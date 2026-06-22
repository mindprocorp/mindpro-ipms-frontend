import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui";

export interface EditColumn {
  header: string;
  width?: string;
  render: () => React.ReactNode;
}

interface Props {
  columns: EditColumn[];
}

const DocEditRow = ({ columns }: Props) => (
  <div className="mb-2 overflow-hidden rounded-md border">
    <Table>
      <colgroup>
        {columns.map((col, i) => (
          <col key={i} style={col.width ? { width: col.width } : undefined} />
        ))}
      </colgroup>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} className="bg-blue-50/60 text-center text-xs font-semibold">
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {columns.map((col, i) => (
            <TableCell key={i} className="px-1 py-1 text-center text-xs">
              {col.render()}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

export default DocEditRow;
