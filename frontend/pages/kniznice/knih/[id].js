import { useState, useEffect } from "react";
import AppWrapper from "../../../components/AppWrapper";
import AddBook from "../../../components/AddBook";
import LendBook from "../../../components/LendBook";
import { Table, ButtonGroup } from "react-bootstrap";
import Button from "../../../components/Button";
import { isEmpty } from "lodash";
import axios from "axios";
import { useRouter } from "next/router";

const Kniznice = () => {
  const router = useRouter();
  const { id } = router.query;

  // Tlacidla Submenu
  const submenu = [
    {
      href: `/kniznice/stud/${id}`,
      name: "studenti",
      color: "outline-secondary",
    },
    {
      func: () => handleOpenAdd(true),
      name: "nova kniha",
      color: "success",
    },
  ];

  const [bookIdAdd, setbookIdAdd] = useState(false);
  const [bookIdLend, setbookIdLend] = useState(false);
  const [brand, setBrand] = useState("nazov");
  const [tableData, settableData] = useState([]);
  const [trigger, settrigger] = useState(true);

  const runTrigger = () => {
    settrigger(!trigger);
  };

  //Add
  const handleOpenAdd = (bookIdAdd) => {
    setbookIdAdd(bookIdAdd);
  };
  const handleCloseAdd = () => {
    setbookIdAdd(false);
  };

  //Lend
  const handleOpenLend = (bookIdLend) => {
    setbookIdLend(bookIdLend);
  };
  const handleCloseLend = () => {
    setbookIdLend(false);
  };

  //Del
  const handleDelete = (ISBN) => {
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/libraries/delBook/${id}/${ISBN}`,
      {}
    );
    runTrigger();
  };

  useEffect(() => {
    if (!isEmpty(id)) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/libraries/booksOf/${id}`)
        .then((response) => settableData(response.data));
    }
  }, [id, trigger]);

  useEffect(() => {
    if (!isEmpty(id)) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/libraries/libName/${id}`)
        .then((response) => setBrand(response.data));
    }
  }, []);

  return (
    <AppWrapper submenu={submenu} brand={brand}>
      {id !== undefined && (
        <>
          <AddBook
            libId={id}
            runTrigger={runTrigger}
            bookId={bookIdAdd}
            handleClose={handleCloseAdd}
          />
          <LendBook
            libId={id}
            runTrigger={runTrigger}
            bookId={bookIdLend}
            handleClose={handleCloseLend}
          />
        </>
      )}
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>nazov</th>
            <th>autor</th>
            <th>pozicana</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.ISBN}>
              <td>{item.ISBN}</td>
              <td>{item.name}</td>
              <td>{item.autor}</td>
              <td>{item.leased === "false" ? "dostupna" : item.leased}</td>
              <td>
                {item.leased === "false" ? (
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenLend(item.ISBN)}
                    >
                      Pozicat
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.ISBN)}
                    >
                      X
                    </Button>
                  </ButtonGroup>
                ) : (
                  <ButtonGroup>
                    <Button variant="outline-primary" size="sm" disabled>
                      Pozicat
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => alert("najpr vrat knihu")}
                    >
                      X
                    </Button>
                  </ButtonGroup>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AppWrapper>
  );
};

export default Kniznice;
