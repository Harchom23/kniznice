import express from "express";
import Student from "../models/Student.model";
import Library from "../models/Library.model";
import { filter, find, map, includes } from "lodash";
import { checkFilled } from "../utils";

const router = express.Router();

// GET all student
router.get("/", (req, res, next) => {
  Student.find()
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});
// GET student
router.get("/studId/:id", (req, res, next) => {
  const _id = req.params.id;
  Student.findById(_id)
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//Add new student
router.post("/add", (req, res, next) => {
  const rodCislo = req.body.rodCislo;
  const name = req.body.name;
  const surname = req.body.surname;
  const leasedBook = [];
  const history = [];

  if (checkFilled([rodCislo, name, surname], res)) {
    Student.findOne({ rodCislo: rodCislo })
      .then((foundStudent) => {
        if (foundStudent) {
          res.status(409).json({
            response: `Uzivatel s rodnym cislom: ${rodCislo} uz existuje.`,
            ...foundStudent,
          });
        } else {
          const newStudent = new Student({
            rodCislo,
            name,
            surname,
            leasedBook,
            history,
          });

          newStudent.save().then(() => res.status(201).json("pridane"));
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

//Edit student
router.post("/edit/:id", (req, res, next) => {
  const _id = req.params.id;
  const name = req.body.name;
  const surname = req.body.surname;

  if (checkFilled([name, surname], res)) {
    Student.findByIdAndUpdate(_id, { name, surname })
      .then(() => res.status(200).json("editovane"))
      .catch((err) => res.status(400).json("Error: ", err));
  }
});

//Lend Book
router.post("/lendBook/:id/:ISBN", (req, res, next) => {
  const _id = req.params.id;
  const ISBN = req.params.ISBN;
  const rodCislo = req.body.rodCislo;

  if (checkFilled([rodCislo], res)) {
    Library.findById(_id).then((library) => {
      if (includes(library.regStudents, rodCislo)) {
        Student.findOneAndUpdate(
          { rodCislo: rodCislo },
          {
            $push: {
              leasedBook: {
                idLibrary: _id,
                ISBN: ISBN,
              },
            },
          }
        )
          .then(() => res.status(201).json("pozicane"))
          .catch((err) => res.status(400).json({ "Error: ": err }));
      } else {
        res.status(409).json({
          response: `Uzivatel s rodnym cislom: ${rodCislo} nieje v kniznici.`,
        });
      }
    });
  }
});

//Lended books of student
router.get("/leasedBooks/:libId/:studId", (req, res, next) => {
  const _id = req.params.studId;
  const libId = req.params.libId;
  Student.findById(_id)
    .then((student) => {
      const leasedBooks = filter(
        student.leasedBook,
        (book) => book.idLibrary === libId
      );
      Library.findById(libId)
        .then((library) => {
          const booksWithNames = [];
          map(leasedBooks, (book) => {
            const bookFromLibrary = find(library.books, (libBook) => {
              return libBook.ISBN === book.ISBN;
            });
            booksWithNames.push({
              name: bookFromLibrary.name,
              ISBN: book.ISBN,
              leasDate: book.leasDate,
            });
          });
          return booksWithNames;
        })
        .then((allBooks) => {
          res.status(200).json(allBooks);
        });
    })

    .catch((err) => res.status(400).json("Error: ", err));
});

//Return book
router.post("/return/:id/:ISBN", (req, res, next) => {
  const _id = req.params.id;
  const ISBN = req.params.ISBN;
  const libId = req.body.libId;

  Student.findById(_id)
    .then((student) => {
      const { leasDate } = find(
        student.leasedBook,
        (book) => book.idLibrary === libId && book.ISBN === ISBN
      );
      return leasDate;
    })
    .then((leasDate) => {
      Student.findByIdAndUpdate(_id, {
        $push: {
          history: {
            idLibrary: libId,
            ISBN: ISBN,
            leasDate: leasDate,
          },
        },
      }).then(() => {
        Student.findByIdAndUpdate(_id, {
          $pull: {
            leasedBook: { idLibrary: libId, ISBN: ISBN },
          },
        })
          .then(() => res.status(200).json("vymazane"))
          .catch((err) => res.status(400).json("Error: ", err));
      });
    });
});

//get history in lib
router.get("/history/:libId/:studentId", (req, res, next) => {
  const libId = req.params.libId;
  const _id = req.params.studentId;

  Student.findById(_id)
    .then((student) => {
      const history = filter(
        student.history,
        (book) => book.idLibrary === libId
      );
      res.status(200).json(history);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

//get history all lib
router.get("/history/:studentId", (req, res, next) => {
  const _id = req.params.studentId;

  Student.findById(_id)
    .then((student) => {
      res.status(200).json(student.history);
    })
    .catch((err) => res.status(400).json("Error: ", err));
});

export default router;
