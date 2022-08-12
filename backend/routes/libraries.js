import express from "express";
import Library from "../models/Library.model";
import Student from "../models/Student.model";
import { includes, isEmpty } from "lodash";
import { checkFilled } from "../utils";

const router = express.Router();

// get all
router.get("/", (req, res, next) => {
  Library.find()
    .then((libraries) => {
      res.status(200).json(libraries);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//get single
router.get("/libId/:id", (req, res, next) => {
  const _id = req.params.id;
  Library.findById(_id)
    .then((library) => {
      res.status(200).json(library);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//get lib name
router.get("/libName/:id", (req, res, next) => {
  const _id = req.params.id;
  Library.findById(_id)
    .then((library) => {
      res.status(200).json(library.name);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//add
router.post("/add", (req, res, next) => {
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;

  if (checkFilled([name, address, city], res)) {
    const newLibrary = new Library({ name, address, city });

    newLibrary
      .save()
      .then(() => res.status(201).json("pridane"))
      .catch((err) => res.status(401).json("Error: ", err));
  }
});

//edit
router.post("/edit/:id", (req, res, next) => {
  const _id = req.params.id;
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;

  if (checkFilled([name, address, city], res)) {
    Library.findByIdAndUpdate(_id, { name, address, city })
      .then(() => res.status(200).json("editovane"))
      .catch((err) => res.status(400).json("Error: ", err));
  }
});

//del
router.post("/delete/:id", (req, res, next) => {
  const _id = req.params.id;
  Library.findByIdAndDelete(_id)
    .then(() => res.status(200).json("vymazane"))
    .catch((err) => res.status(400).json("Error: ", err));
});

//**********************************************************BOOKS*****************************************************/

//get books of Lib
router.get("/booksOf/:id", (req, res, next) => {
  const _id = req.params.id;
  Library.findById(_id)
    .then((library) => {
      res.status(200).json(library.books);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//add book to lib
router.post("/addBook/:id", (req, res, next) => {
  const _id = req.params.id;
  const ISBN = req.body.ISBN;
  const name = req.body.name;
  const autor = req.body.autor;
  const leased = false;

  if (checkFilled([name, autor, ISBN], res)) {
    Library.findById(_id).then((library) => {
      const allISBNinLib = map(library.books, (book) => {
        const ISBNInLib = book.ISBN;
        return ISBNInLib;
      });
      if (!includes(allISBNinLib, ISBN)) {
        Library.findByIdAndUpdate(_id, {
          $push: {
            books: {
              ISBN,
              name,
              autor,
              leased,
            },
          },
        })
          .then(() => res.status(201).json("pridanaa"))
          .catch((err) => res.status(400).json("Error: ", err));
      } else {
        res.status(409).json({
          response: `Kniha s ISBN: ${ISBN} uz v kniznici je.`,
        });
      }
    });
  }
});

//Lend book
router.post("/lendBook/:id/:ISBN", (req, res, next) => {
  const _id = req.params.id;
  const ISBN = req.params.ISBN;
  const rodCislo = req.body.rodCislo;

  if (checkFilled([rodCislo], res)) {
    Library.findById(_id).then((library) => {
      if (includes(library.regStudents, rodCislo)) {
        Library.findOneAndUpdate(
          { _id, books: { $elemMatch: { ISBN: ISBN } } },
          { $set: { "books.$.leased": rodCislo } }
        )
          .then(() => res.status(200).json("pozicane"))
          .catch((err) => res.status(400).json("Error: ", err));
      } else {
        res.status(409).json({
          response: `Uzivatel s rodnym cislom: ${rodCislo} nieje v kniznici.`,
        });
      }
    });
  }
});

//Return book
router.post("/returnBook/:id/:ISBN", (req, res, next) => {
  const _id = req.params.id;
  const ISBN = req.params.ISBN;
  const ret = "false";

  Library.findOneAndUpdate(
    { _id, books: { $elemMatch: { ISBN: ISBN } } },
    { $set: { "books.$.leased": ret } }
  )
    .then(() => res.status(200).json("vratena"))
    .catch((err) => res.status(400).json("Error: ", err));
});

//Del book
router.post("/delBook/:id/:ISBN", (req, res, next) => {
  const _id = req.params.id;
  const ISBN = req.params.ISBN;

  Library.findByIdAndUpdate(_id, {
    $pull: {
      books: { ISBN },
    },
  })
    .then(() => res.status(200).json("vymazane"))
    .catch((err) => res.status(400).json("Error: ", err));
});

//****************************************************************Students****************************************/

//Get stud of lib
router.get("/studentsOf/:id", (req, res, next) => {
  const _id = req.params.id;

  Library.findById(_id)
    .then((library) => {
      const { regStudents } = library;

      Student.find()
        .where("rodCislo")
        .in(regStudents)
        .then((allRegStudents) => res.status(200).json(allRegStudents));
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//Add stud to lib
router.post("/addStudent/:id", (req, res, next) => {
  const _id = req.params.id;
  const rodCislo = req.body.rodCislo;

  Student.findOne({ rodCislo: rodCislo }).then((foundStudent) => {
    if (foundStudent) {
      Library.findById(_id).then((library) => {
        if (includes(library.regStudents, rodCislo)) {
          res.status(409).json({
            response: `Uzivatel s rodnym cislom: ${rodCislo} uz v kniznici je.`,
          });
        } else {
          Library.findByIdAndUpdate(_id, {
            $push: {
              regStudents: rodCislo,
            },
          }).then(() => res.status(201).json("pridane"));
        }
      });
    } else {
      res.status(418).json({
        response: `Uzivatel s rodnym cislom: ${rodCislo} neexistuje.`,
      });
    }
  });
});

//Remove stud form lib
router.post("/removeStudent/:id/:rodCislo", (req, res, next) => {
  const _id = req.params.id;
  const rodCislo = req.params.rodCislo;
  Library.findByIdAndUpdate(_id, {
    $pull: {
      regStudents: rodCislo,
    },
  })
    .then(() => res.status(200).json("vymazane"))
    .catch((err) => res.status(400).json("Error: ", err));
});
export default router;
