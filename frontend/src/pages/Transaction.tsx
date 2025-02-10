import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Form, Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CreateTransactionModal from "../components/CreateTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import { Transaction } from "../types/transaction";
import ViewTransactionModal from "../components/ViewTransactionModal";
import socket from "../config/socket";
const API_URL = import.meta.env.VITE_API_URL;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Récupération des transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`);
      const sortedTransactions = response.data.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Écoute des événements WebSocket
    socket.on("transactionCreated", ({ id }) => {
      console.log(`New transaction created: ${id}`);
      toast.info(`New transaction created: ${id}`);
      fetchTransactions(); // Recharger la liste
    });

    socket.on("transactionConfirmed", ({ id }) => {
      console.log(`Confirmed transaction: ${id}`);
      toast.success(`Confirmed transaction: ${id}`);
      fetchTransactions(); // Mettre à jour la liste
    });

    // Nettoyage des événements lors du démontage du composant
    return () => {
      socket.off("transactionCreated");
      socket.off("transactionConfirmed");
    };
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    return (
      (search === "" ||
        tx.id.includes(search) ||
        tx.sender.includes(search) ||
        tx.receiver.includes(search)) &&
      (startDate === "" || new Date(tx.timestamp) >= new Date(startDate)) &&
      (endDate === "" || new Date(tx.timestamp) <= new Date(endDate))
    );
  });

  const totalValue = filteredTransactions.reduce(
    (sum, tx) => sum + tx.value,
    0
  );
  const confirmedCount = filteredTransactions.filter(
    (tx) => tx.confirmed
  ).length;
  const pendingCount = filteredTransactions.length - confirmedCount;

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const viewTransactionDetails = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setShowViewModal(true); // Afficher le modal des détails
  };

  return (
    <div className="container mt-4">
      <Card className="p-3 mb-3 shadow-sm">
        <Row>
          <Col>
            <strong>Total Transactions:</strong> {totalValue} XAF
          </Col>
          <Col>
            <strong>Confirmed:</strong> {confirmedCount}
          </Col>
          <Col>
            <strong>Pending:</strong> {pendingCount}
          </Col>
        </Row>
      </Card>
      <Button
        variant="primary"
        onClick={() => setShowCreateModal(true)}
        className="mb-3"
      >
        Add Transaction
      </Button>
      <Form className="mb-3">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by ID, Sender, Receiver"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Value</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.sender}</td>
              <td>{tx.receiver}</td>
              <td>{tx.value} XAF</td>
              <td>{tx.confirmed ? "Confirmed" : "Pending"}</td>
              <td>{new Date(tx.timestamp).toLocaleString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => viewTransactionDetails(tx)}
                >
                  View
                </Button>{" "}
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setSelectedTransaction(tx);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(filteredTransactions.length / itemsPerPage))].map(
          (_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
      <CreateTransactionModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
      />
      {selectedTransaction && (
        <EditTransactionModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          transaction={selectedTransaction}
        />
      )}
      {selectedTransaction && (
        <ViewTransactionModal
          show={showViewModal}
          handleClose={() => setShowViewModal(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
