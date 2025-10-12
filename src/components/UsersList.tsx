//src/components/UsersList.tsx

"use client";

import { UserType } from "@/schemas/userSchema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type UsersListProps = {
  users: UserType[];
};

export function UsersList({ users }: UsersListProps) {
  if (!users || users.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">No users found.</Card>
    );
  }

  return (
    <Card className="p-4 shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name ?? "-"}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
