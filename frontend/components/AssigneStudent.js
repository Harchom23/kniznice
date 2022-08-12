import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleSubmit = (event, runTrigger, libId) => {
  event.preventDefault();

  const { elements: etf } = event.target.form;
  const rodCislo = etf.rodCislo.value;

  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/libraries/addStudent/${libId}`, {
      rodCislo,
    })
    .catch((error) => {
      alert(error.response.data.response);
    })
    .then(() => runTrigger());
};

const AssignStudent = ({ libId, runTrigger, studentId, handleClose }) => {
  return (
    <>
      <Modal size="lg" show={studentId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Novy student</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Rodne cislo (ID)</Form.Label>
              <Form.Control name="rodCislo" autoFocus />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleSubmit(event, runTrigger, libId);
                handleClose();
              }}
            >
              Priradit
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

export default AssignStudent;
