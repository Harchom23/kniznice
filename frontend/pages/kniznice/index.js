import { useState, useEffect } from "react";
import AddLibrary from "../../components/AddLibrary";
import EditLibrary from "../../components/EditLibrary";
import AppWrapper from "../../components/AppWrapper";
import { Table, ButtonGroup } from "react-bootstrap";
import Button from "../../components/Button";
import Link from "next/link";
import axios from "axios";

const Kniznice = () => {
  // Tlacidla Submenu
  const submenu = [
    {
      func: () => handleOpenAdd(true),
      name: "nova kniznica",
      color: "success",
    },
  ];

  const [addLibId, setaddLibId] = useState(false);
  const [editLibId, seteditLibId] = useState(false);
  const [tableData, settableData] = useState([]);
  const [trigger, settrigger] = useState(true);

  const runTrigger = () => {
    settrigger(!trigger);
  };

  //Add
  const handleOpenAdd = (addLibId) => {
    setaddLibId(addLibId);
  };
  const handleCloseAdd = () => {
    setaddLibId(false);
  };

  //Edit
  const handleOpenEdit = (editLibId) => {
    seteditLibId(editLibId);
  };
  const handleCloseEdit = () => {
    seteditLibId(false);
  };

  //Del
  const handleDelete = (_id) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/libraries/delete/${_id}`, {})
      .then(() => runTrigger());
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/libraries/`)
      .then((response) => settableData(response.data));
  }, [trigger]);

  return (
    <AppWrapper submenu={submenu} brand={"Evidencia kniznic"}>
      <AddLibrary
        libId={addLibId}
        runTrigger={runTrigger}
        handleClose={handleCloseAdd}
      />
      <EditLibrary
        libId={editLibId}
        runTrigger={runTrigger}
        handleClose={handleCloseEdit}
      />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>nazov</th>
            <th>adresa</th>
            <th>mesto</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item._id}>
              <Link href={`/kniznice/knih/${item._id}`}>
                <td>{item.name}</td>
              </Link>
              <Link href={`/kniznice/knih/${item._id}`}>
                <td>{item.address}</td>
              </Link>
              <Link href={`/kniznice/knih/${item._id}`}>
                <td>{item.city}</td>
              </Link>
              <td>
                <ButtonGroup>
                  <Button
                    variant="info"
                    size="sm"
                    href={`/kniznice/knih/${item._id}`}
                  >
                    Otvor
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      handleOpenEdit(item._id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    X
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

export default Kniznice;
