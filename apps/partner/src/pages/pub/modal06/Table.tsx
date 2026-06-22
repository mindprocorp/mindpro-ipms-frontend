import {
  Table as BasicTable,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
];

export const Table = () => {
  return (
    <BasicTable>
      {/* <TableCaption className="hidden">A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-bg-100 dark:bg-background-color [&>th]:h-7 [&>th]:border-l [&>th]:text-xs">
          <TableHead className="w-25">구분</TableHead>
          <TableHead>건수</TableHead>
          <TableHead className="text-right">공급가액</TableHead>
          <TableHead className="text-right">세액</TableHead>
          <TableHead className="text-right">합계금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow className="[&>td]:border-l [&>td]:text-xs" key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell className="text-right">{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </BasicTable>
  );
};
