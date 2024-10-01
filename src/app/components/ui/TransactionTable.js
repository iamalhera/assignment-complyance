'use client';

import { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import ApprovalButtons from './ApprovalButtons';

export default function TransactionTable({ userRole }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
  };

  const columns = [
    { Header: 'Type', accessor: 'type' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Status', accessor: 'status' },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        userRole === 'manager' && row.original.status === 'Pending' ? (
          <ApprovalButtons
            transactionId={row.original.id}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : null
      ),
    },
  ];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: transactions });

  const handleApprove = async (id) => {
    await fetch(`/api/transactions/${id}/approve`, { method: 'PUT' });
    fetchTransactions();
  };

  const handleReject = async (id) => {
    await fetch(`/api/transactions/${id}/reject`, { method: 'PUT' });
    fetchTransactions();
  };

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}