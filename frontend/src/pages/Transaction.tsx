import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Form, Row, Col, Card } from "react-bootstrap";
const API_URL = import.meta.env.apiBaseUrl;

export interface Transaction {
  id: string;
  value: number;
  timestamp: number;
  receiver: string;
  confirmed: boolean;
  sender: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  //Récupération des transactions
  const fetchTransactions = async () => {
    try {
        const response = await axios.get(`http://localhost:3010/api/transactions`);
        setTransactions(response.data);
        console.log(response)
    } catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error);
    }
};

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = Array.isArray(transactions) ? transactions.filter((tx) => {
    return (
      (search === "" ||
        tx.id.includes(search) ||
        tx.sender.includes(search) ||
        tx.receiver.includes(search)) &&
      (startDate === "" || new Date(tx.timestamp) >= new Date(startDate)) &&
      (endDate === "" || new Date(tx.timestamp) <= new Date(endDate))
    );
  }) : [];
  

  const totalValue = filteredTransactions.reduce((sum, tx) => sum + tx.value, 0);
  const confirmedCount = filteredTransactions.filter((tx) => tx.confirmed).length;
  const pendingCount = filteredTransactions.length - confirmedCount;

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4">
      <Card className="p-3 mb-3 shadow-sm">
        <Row>
          <Col><strong>Total Transactions:</strong> {totalValue} XAF</Col>
          <Col><strong>Confirmed:</strong> {confirmedCount}</Col>
          <Col><strong>Pending:</strong> {pendingCount}</Col>
        </Row>
      </Card>
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
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(filteredTransactions.length / itemsPerPage))].map((_, i) => (
          <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default TransactionsPage;
