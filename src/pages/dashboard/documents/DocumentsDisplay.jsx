import Loader from "../../../components/Loader.jsx";

export default function DocumentsDisplay({
  data,
  documentType,
  loading,
  total,
}) {
  return (
    <>
      <table className="documents-display-table">
        <Loader loading={loading} onlyLoader={true}></Loader>

        {documentType == "invoices" && (
          <>
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date of Issue</th>
                <th>Client</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data?.invoices?.map((invoice, index) => {
                return (
                  <tr key={index}>
                    <td>{invoice.invoice_number}</td>
                    {/* Date format */}
                    <td>21.05.2025</td>
                    <td>{invoice.receiver_name}</td>
                    <td>20 zl</td>
                  </tr>
                );
              })}
            </tbody>
          </>
        )}

        {documentType == "clients" && (
          <>
            <thead>
              <tr>
                <th>Client</th>
                <th>Address</th>
                <th>Nip</th>
              </tr>
            </thead>
            <tbody>
              {data?.clients?.map((client, index) => {
                return (
                  <tr key={index}>
                    <td>{client.name}</td>
                    <td>{client.address}</td>
                    <td>{client.nip}</td>
                  </tr>
                );
              })}
            </tbody>
          </>
        )}
      </table>

      {loading && (
        <p
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "transparent",
          }}
        >
          -
        </p>
      )}

      {!loading && total == 0 && (
        <p
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No results
        </p>
      )}
    </>
  );
}
