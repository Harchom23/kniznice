import AppWrapper from "../../../components/AppWrapper";
import { useState, useEffect } from "react";
import { Table, ButtonGroup } from "react-bootstrap";
import AddStudent from "../../../components/AddStudent";
import EditStudent from "../../../components/EditStudent";
import { isEmpty } from "lodash";
import Button from "../../../components/Button";
import ReturnBook from "../../../components/ReturnBook";
import History from "../../../components/History";
import { useRouter } from "next/router";
import AssignStudent from "../../../components/AssigneStudent";
import axios from "axios";

const Students = () => {
  const router = useRouter();
  const { id } = router.query;

  // Tlacidla Submenu
  const submenu = [
    {
      href: `/kniznice/knih/${id}`,
      name: "knihy",
      color: "outline-secondary",
    },
    {
      func: () => handleOpenAssign(true),
      name: "prirad studenta",
      color: "primary",
    },
    {
      func: () => handleOpenAdd(true),
      name: "novy student",
      color: "success",
    },
  ];

  const [studentIdAdd, setstudentIdAdd] = useState(false);
  const [studentIdAssign, setstudentIdAssign] = useState(false);
  const [studentIdEdit, setStudentIdEdit] = useState(false);
  const [studentIdReturn, setstudentIdReturn] = useState(false);
  const [studentIdHistory, setstudentIdHistory] = useState(false);
  const [tableData, settableData] = useState([]);
  const [brand, setBrand] = useState("nazov");
  const [trigger, settrigger] = useState(true);

  const runTrigger = () => {
    settrigger(!trigger);
  };

  //Add
  const handleOpenAdd = (studentIdAdd) => {
    setstudentIdAdd(studentIdAdd);
  };
  const handleCloseAdd = () => {
    setstudentIdAdd(false);
  };

  //Assign
  const handleOpenAssign = (studentIdAssign) => {
    setstudentIdAssign(studentIdAssign);
  };
  const handleCloseAssign = () => {
    setstudentIdAssign(false);
  };

  //Edit
  const handleOpenEdit = (studentIdEdit) => {
    setStudentIdEdit(studentIdEdit);
  };
  const handleCloseEdit = () => {
    setStudentIdEdit(false);
  };

  //Return
  const handleOpenReturn = (studentIdReturn) => {
    setstudentIdReturn(studentIdReturn);
  };
  const handleCloseReturn = () => {
    setstudentIdReturn(false);
  };

  //History
  const handleOpenHistory = (studentIdHistory) => {
    setstudentIdHistory(studentIdHistory);
  };
  const handleCloseHistory = () => {
    setstudentIdHistory(false);
  };

  //Remove
  const handleRemove = (rodCislo) => {
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/libraries/removeStudent/${id}/${rodCislo}`,
      {}
    );
    runTrigger();
  };

  //Get Lib NAME
  useEffect(() => {
    if (!isEmpty(id)) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/libraries/libName/${id}`)
        .then((response) => setBrand(response.data));
    }
  }, []);

  //Get data
  useEffect(() => {
    if (!isEmpty(id)) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/libraries/studentsOf/${id}`)
        .then((response) => settableData(response.data));
    }
  }, [id, trigger]);

  return (
    <AppWrapper submenu={submenu} brand={brand}>
      <AssignStudent
        libId={id}
        runTrigger={runTrigger}
        studentId={studentIdAssign}
        handleClose={handleCloseAssign}
      />
      <AddStudent
        libId={id}
        runTrigger={runTrigger}
        studentId={studentIdAdd}
        handleClose={handleCloseAdd}
      />
      <EditStudent
        runTrigger={runTrigger}
        studentId={studentIdEdit}
        handleClose={handleCloseEdit}
      />
      <ReturnBook
        libId={id}
        studentId={studentIdReturn}
        handleClose={handleCloseReturn}
      />
      <History
        libId={id}
        studentId={studentIdHistory}
        handleClose={handleCloseHistory}
      />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>rod. cislo</th>
            <th>meno</th>
            <th>priezvisko</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.rodCislo}>
              <td>{item.rodCislo}</td>
              <td>{item.name}</td>
              <td>{item.surname}</td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenReturn(item._id)}
                  >
                    Vrat knihu
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleOpenEdit(item._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenHistory(item._id)}
                  >
                    Historia
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(item.rodCislo)}
                  >
                    Vylucit
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AppWrapper>
  );
};

export default Students;
