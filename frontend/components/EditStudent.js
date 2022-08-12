import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleSubmit = (event, studentId, runTrigger, handleClose) => {
  event.preventDefault();

  const { elements: etf } = event.target.form;
  const name = etf.name.value;
  const surname = etf.surname.value;

  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/students/edit/${studentId}`, {
      name,
      surname,
    })
    .then((response) => {
      if (response.status === 200) {
        runTrigger();
        handleClose();
      }
    })
    .catch((error) => {
      alert(error.response.data.response);
    });
};

const AddStudent = ({ runTrigger, studentId, handleClose }) => {
  const [defaultData, setdefaultData] = useState();

  useEffect(() => {
    if (typeof studentId === "string") {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/students/studId/${studentId}`)
        .then((response) => {
          setdefaultData(response.data);
        });
    }
    return setdefaultData();
  }, [studentId]);

  return (
    <>
      <Modal size="lg" show={studentId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit studenta</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Meno</Form.Label>
              <Form.Control
                name="name"
                autoFocus
                defaultValue={defaultData?.name}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priezvisko</Form.Label>
              <Form.Control
                name="surname"
                defaultValue={defaultData?.surname}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rodne cislo (ID)</Form.Label>
              <Form.Control
                name="rodCislo"
                disabled
                defaultValue={defaultData?.rodCislo}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleSubmit(event, studentId, runTrigger, handleClose);
              }}
            >
              Ulozit
            </Button>
            <Button variant="outline-danger" onClick={handleClose}>
              Zrusit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddStudent;
