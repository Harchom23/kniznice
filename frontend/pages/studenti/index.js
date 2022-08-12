import AppWrapper from "../../components/AppWrapper";
import { useState, useEffect } from "react";
import { Table, NavItem, ButtonGroup } from "react-bootstrap";
import Button from "../../components/Button";
import EditStudent from "../../components/EditStudent";
import History from "../../components/History";
import axios from "axios";

const Students = () => {
  // Tlacidla Submenu
  const submenu = [];

  const [studentIdEdit, setstudentIdEdit] = useState(false);
  const [studentIdHistory, setstudentIdHistory] = useState(false);
  const [tableData, settableData] = useState([]);
  const [trigger, settrigger] = useState(true);

  const runTrigger = () => {
    settrigger(!trigger);
  };

  //Edit
  const handleOpenEdit = (studentIdEdit) => {
    setstudentIdEdit(studentIdEdit);
  };
  const handleCloseAdd = () => {
    setstudentIdEdit(false);
  };

  //History
  const handleOpenHistory = (studentIdHistory) => {
    setstudentIdHistory(studentIdHistory);
  };
  const handleCloseHistory = () => {
    setstudentIdHistory(false);
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/students/`)
      .then((response) => {
        settableData(response.data);
      });
  }, [trigger]);

  return (
    <AppWrapper submenu={submenu} brand={"Evidencia studentov"}>
      <EditStudent
        runTrigger={runTrigger}
        studentId={studentIdEdit}
        handleClose={handleCloseAdd}
      />
      <History
        libId={"all"}
        studentId={studentIdHistory}
        handleClose={handleCloseHistory}
      />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>rod. cislo</th>
            <th>meno</th>
            <th>priezvisko</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((item) => (
              <tr key={item._id}>
                <td>{item.rodCislo}</td>
                <td>{item.name}</td>
                <td>{item.surname}</td>
                <td>
                  <ButtonGroup>
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
