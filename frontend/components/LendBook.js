import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleSubmit = (event, runTrigger, bookId, libId) => {
  event.preventDefault();

  const { elements: etf } = event.target.form;
  const rodCislo = etf.rodCislo.value;

  axios
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/students/lendBook/${libId}/${bookId}`,
      {
        rodCislo,
      }
    )
    .catch((error) => {});

  axios
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/libraries/lendBook/${libId}/${bookId}`,
      {
        rodCislo,
      }
    )
    .then(() => runTrigger())
    .catch((error) => {
      alert(error.response.data.response);
    });
};

const LendBook = ({ libId, runTrigger, bookId, handleClose }) => {
  return (
    <>
      <Modal show={bookId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pozicanie knihy</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Rodne cislo studenta</Form.Label>
              <Form.Control autoFocus name="rodCislo" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleSubmit(event, runTrigger, bookId, libId);
                handleClose();
              }}
            >
              Pozicat
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

export default LendBook;
