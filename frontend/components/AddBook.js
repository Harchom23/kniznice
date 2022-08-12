import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const handleSubmit = async (libId, runTrigger, event, handleClose) => {
  event.preventDefault();
  const { elements: etf } = event.target.form;
  const ISBN = etf.ISBN.value;
  const name = etf.name.value;
  const autor = etf.autor.value;

  await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/libraries/addBook/${libId}`, {
      ISBN,
      name,
      autor,
    })
    .then((response) => {
      if (response.status === 201) {
        handleClose();
        runTrigger();
      }
    })
    .catch((error) => {
      alert(error.response.data.response);
    });
};

const AddBook = ({ libId, runTrigger, bookId, handleClose }) => {
  return (
    <>
      <Modal size="lg" show={bookId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nova kniha</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control name="ISBN" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nazov knihy</Form.Label>
              <Form.Control name="name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control name="autor" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={(event) => {
                handleSubmit(libId, runTrigger, event, handleClose);
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

export default AddBook;
