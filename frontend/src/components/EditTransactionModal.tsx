import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Transaction } from "../types/transaction";

interface EditTransactionModalProps {
  show: boolean;
  handleClose: () => void;
  transaction: Transaction;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ show, handleClose, transaction }) => {
  const [formData, setFormData] = useState<Transaction>(transaction);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value, // Convert value to number if needed
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔹 Appel API pour modifier la transaction
      await axios.put(`http://localhost:3010/api/transactions/${transaction.id}`, formData);

      console.log("Transaction mise à jour :", formData);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la transaction :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier la Transaction</Modal.Title>
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
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmed: e.target.checked }))}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTransactionModal;
