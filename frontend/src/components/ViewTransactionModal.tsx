import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Transaction } from "../types/transaction";

interface ViewTransactionModalProps {
  show: boolean;
  handleClose: () => void;
  transaction: Transaction | null;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({
  show,
  handleClose,
  transaction,
}) => {
  if (!transaction) return null; // Si aucune transaction sélectionnée, ne rien afficher

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Transaction Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <strong>ID: </strong> {transaction.id}
        </div>
        <div>
          <strong>Sender: </strong> {transaction.sender}
        </div>
        <div>
          <strong>Receiver: </strong> {transaction.receiver}
        </div>
        <div>
          <strong>Value: </strong> {transaction.value} XAF
        </div>
        <div>
          <strong>Status: </strong> {transaction.confirmed ? "Confirmed" : "Pending"}
        </div>
        <div>
          <strong>Timestamp: </strong> {new Date(transaction.timestamp).toLocaleString()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewTransactionModal;
