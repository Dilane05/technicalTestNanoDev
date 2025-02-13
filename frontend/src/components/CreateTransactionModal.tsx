import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { CreateTransaction } from "../types/transaction";
const API_URL = import.meta.env.VITE_API_URL;

interface CreateTransactionModalProps {
  show: boolean;
  handleClose: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  show,
  handleClose,
}) => {
  const [formData, setFormData] = useState<CreateTransaction>({
    sender: "",
    receiver: "",
    value: 0,
    confirmed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "value"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transaction à envoyer :", formData);

    // Appel API pour créer une transaction
    try {
      const response = await axios.post(
        `${API_URL}/api/transactions`,
        formData
      );
      console.log("Transaction créée :", response.data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la création de la transaction :", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Créer une Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Expéditeur</Form.Label>
            <Form.Control
              type="text"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Récepteur</Form.Label>
            <Form.Control
              type="text"
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Montant</Form.Label>
            <Form.Control
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Confirmé"
              name="confirmed"
              checked={formData.confirmed}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Créer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTransactionModal;
