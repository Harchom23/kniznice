import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleSubmit = (event, runTrigger, libId, handleClose) => {
  event.preventDefault();

  const { elements: etf } = event.target.form;
  const rodCislo = etf.rodCislo.value;
  const name = etf.name.value;
  const surname = etf.surname.value;

  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/students/add`, {
      rodCislo,
      name,
      surname,
    })
    .then((response) => {
      if (response.status === 201) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/libraries/addStudent/${libId}`,
            {
              rodCislo,
            }
          )
          .then(() => runTrigger(), handleClose());
      }
    })
    .catch((error) => {
      alert(error.response.data.response);
    });
};

const AddStudent = ({ libId, runTrigger, studentId, handleClose }) => {
  return (
    <>
      <Modal size="lg" show={studentId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Novy student</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Meno</Form.Label>
              <Form.Control name="name" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priezvisko</Form.Label>
              <Form.Control name="surname" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rodne cislo (ID)</Form.Label>
              <Form.Control name="rodCislo" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleSubmit(event, runTrigger, libId, handleClose);
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
