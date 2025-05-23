"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Account } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// Dummy data. To be replace by real values from the server.
export const accounts: Account[] = [
	{
		firstName: "Luke",
		lastName: "Exodus",
		email: "helloworld@gmail.com",
		dateCreated: new Date("2025-05-20T10:00:00Z"),
		dateModified: new Date("2025-05-20T10:00:00Z"),
		roles: ["student"],
		classes: ["Javascript Basics", "Data Structures & Algorithms"],
	},
	{
		firstName: "Mia",
		lastName: "Galvez",
		email: "mia.galvez@example.com",
		dateCreated: new Date("2025-05-01T08:00:00Z"),
		dateModified: new Date("2025-05-10T09:00:00Z"),
		roles: ["student"],
		classes: ["Intro to Python", "Algorithms 101"],
	},
	{
		firstName: "Jose",
		lastName: "Ramirez",
		email: "jose.ramirez@example.com",
		dateCreated: new Date("2025-03-15T12:00:00Z"),
		dateModified: new Date("2025-04-01T14:00:00Z"),
		roles: ["teacher"],
		classes: ["Javascript Basics", "Advanced C++"],
	},
	{
		firstName: "Ava",
		lastName: "Delos Santos",
		email: "ava.ds@example.com",
		dateCreated: new Date("2025-02-20T09:30:00Z"),
		dateModified: new Date("2025-05-20T11:00:00Z"),
		roles: ["student"],
		classes: ["UX Design", "Data Structures & Algorithms"],
	},
	{
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@adminmail.com",
		dateCreated: new Date("2024-12-12T07:45:00Z"),
		dateModified: new Date("2025-01-01T10:00:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Bianca",
		lastName: "Yu",
		email: "bianca.yu@example.com",
		dateCreated: new Date("2025-04-04T15:00:00Z"),
		dateModified: new Date("2025-05-01T16:30:00Z"),
		roles: ["teacher"],
		classes: ["Data Structures & Algorithms"],
	},
	{
		firstName: "Caleb",
		lastName: "Reyes",
		email: "caleb.reyes@example.com",
		dateCreated: new Date("2025-01-20T06:00:00Z"),
		dateModified: new Date("2025-04-30T09:15:00Z"),
		roles: ["student"],
		classes: ["Intro to Python"],
	},
	{
		firstName: "Lana",
		lastName: "Martinez",
		email: "lana.martinez@example.com",
		dateCreated: new Date("2025-03-01T13:20:00Z"),
		dateModified: new Date("2025-03-20T14:50:00Z"),
		roles: ["teacher"],
		classes: ["Frontend Development", "Javascript Basics"],
	},
	{
		firstName: "Nathan",
		lastName: "Lee",
		email: "nathan.lee@example.com",
		dateCreated: new Date("2025-02-18T11:00:00Z"),
		dateModified: new Date("2025-04-10T10:00:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Chloe",
		lastName: "Lim",
		email: "chloe.lim@example.com",
		dateCreated: new Date("2025-03-12T08:30:00Z"),
		dateModified: new Date("2025-03-30T09:00:00Z"),
		roles: ["student"],
		classes: ["Advanced C++", "Intro to Python"],
	},
	{
		firstName: "Marco",
		lastName: "Santiago",
		email: "marco.santiago@example.com",
		dateCreated: new Date("2025-04-15T07:00:00Z"),
		dateModified: new Date("2025-04-25T08:00:00Z"),
		roles: ["student"],
		classes: ["Frontend Development"],
	},
	{
		firstName: "Grace",
		lastName: "Tan",
		email: "grace.tan@example.com",
		dateCreated: new Date("2025-05-01T13:00:00Z"),
		dateModified: new Date("2025-05-10T14:30:00Z"),
		roles: ["teacher"],
		classes: ["UX Design"],
	},
	{
		firstName: "Ethan",
		lastName: "Yap",
		email: "ethan.yap@example.com",
		dateCreated: new Date("2025-01-10T10:00:00Z"),
		dateModified: new Date("2025-03-10T11:00:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Sofia",
		lastName: "Navarro",
		email: "sofia.navarro@example.com",
		dateCreated: new Date("2025-04-20T12:00:00Z"),
		dateModified: new Date("2025-05-01T12:30:00Z"),
		roles: ["student"],
		classes: ["UX Design"],
	},
	{
		firstName: "Zion",
		lastName: "Rivera",
		email: "zion.rivera@example.com",
		dateCreated: new Date("2025-02-01T14:00:00Z"),
		dateModified: new Date("2025-04-01T16:00:00Z"),
		roles: ["teacher"],
		classes: ["Algorithms 101", "Javascript Basics"],
	},
	{
		firstName: "Elijah",
		lastName: "Castro",
		email: "elijah.castro@example.com",
		dateCreated: new Date("2025-01-15T10:00:00Z"),
		dateModified: new Date("2025-03-10T11:00:00Z"),
		roles: ["student"],
		classes: ["Javascript Basics", "Intro to Python"],
	},
	{
		firstName: "Isabelle",
		lastName: "Santos",
		email: "isabelle.santos@example.com",
		dateCreated: new Date("2025-02-20T14:30:00Z"),
		dateModified: new Date("2025-05-01T08:15:00Z"),
		roles: ["teacher"],
		classes: ["Data Structures & Algorithms", "Frontend Development"],
	},
	{
		firstName: "Noah",
		lastName: "Velasquez",
		email: "noah.velasquez@example.com",
		dateCreated: new Date("2024-11-30T09:00:00Z"),
		dateModified: new Date("2025-01-10T10:30:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Hannah",
		lastName: "Lorenzo",
		email: "hannah.lorenzo@example.com",
		dateCreated: new Date("2025-04-01T13:00:00Z"),
		dateModified: new Date("2025-05-01T14:20:00Z"),
		roles: ["student"],
		classes: ["UX Design"],
	},
	{
		firstName: "Gabriel",
		lastName: "Chavez",
		email: "gabriel.chavez@example.com",
		dateCreated: new Date("2025-03-12T07:30:00Z"),
		dateModified: new Date("2025-04-15T08:45:00Z"),
		roles: ["teacher"],
		classes: ["Advanced C++", "Algorithms 101"],
	},
	{
		firstName: "Leah",
		lastName: "Padilla",
		email: "leah.padilla@example.com",
		dateCreated: new Date("2025-02-25T10:30:00Z"),
		dateModified: new Date("2025-03-20T11:00:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Isaac",
		lastName: "Garcia",
		email: "isaac.garcia@example.com",
		dateCreated: new Date("2025-01-10T12:00:00Z"),
		dateModified: new Date("2025-01-30T12:45:00Z"),
		roles: ["student"],
		classes: ["Data Structures & Algorithms"],
	},
	{
		firstName: "Emily",
		lastName: "Reyes",
		email: "emily.reyes@example.com",
		dateCreated: new Date("2025-03-01T09:15:00Z"),
		dateModified: new Date("2025-03-25T10:10:00Z"),
		roles: ["teacher"],
		classes: ["Intro to Python"],
	},
	{
		firstName: "Calvin",
		lastName: "Mendoza",
		email: "calvin.mendoza@example.com",
		dateCreated: new Date("2025-04-10T16:00:00Z"),
		dateModified: new Date("2025-05-05T17:00:00Z"),
		roles: ["student"],
		classes: ["Frontend Development"],
	},
	{
		firstName: "Diana",
		lastName: "Villanueva",
		email: "diana.villanueva@example.com",
		dateCreated: new Date("2024-12-01T08:00:00Z"),
		dateModified: new Date("2025-01-05T09:00:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Lucas",
		lastName: "Delgado",
		email: "lucas.delgado@example.com",
		dateCreated: new Date("2025-02-15T11:00:00Z"),
		dateModified: new Date("2025-04-01T12:00:00Z"),
		roles: ["student"],
		classes: ["UX Design", "Advanced C++"],
	},
	{
		firstName: "Zara",
		lastName: "Torres",
		email: "zara.torres@example.com",
		dateCreated: new Date("2025-03-20T10:00:00Z"),
		dateModified: new Date("2025-05-01T11:30:00Z"),
		roles: ["teacher"],
		classes: ["Javascript Basics"],
	},
	{
		firstName: "Nathaniel",
		lastName: "Cruz",
		email: "nathaniel.cruz@example.com",
		dateCreated: new Date("2025-01-25T07:30:00Z"),
		dateModified: new Date("2025-03-01T08:30:00Z"),
		roles: ["admin"],
	},
	{
		firstName: "Faith",
		lastName: "Lopez",
		email: "faith.lopez@example.com",
		dateCreated: new Date("2025-02-10T14:00:00Z"),
		dateModified: new Date("2025-03-15T15:00:00Z"),
		roles: ["student"],
		classes: ["Algorithms 101", "Frontend Development"],
	},
	{
		firstName: "Xander",
		lastName: "Lim",
		email: "xander.lim@example.com",
		dateCreated: new Date("2025-04-01T09:00:00Z"),
		dateModified: new Date("2025-04-20T09:30:00Z"),
		roles: ["teacher"],
		classes: ["UX Design", "Intro to Python"],
	},
];

export const columns: ColumnDef<Account>[] = [
	{
		accessorKey: "lastName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
	},
	{
		accessorKey: "firstName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
	},
	{
		accessorKey: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
	},
	{
		accessorKey: "dateCreated",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Created" />,
		cell: ({ row }) => {
			const date = row.getValue("dateCreated") as Date;
			return format(date, "yyyy-MM-dd HH:mm:ss"); // Consistent format: "2025-05-20 18:00:00"
		},
	},
	{
		accessorKey: "dateModified",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Modified" />,
		cell: ({ row }) => {
			const date = row.getValue("dateModified") as Date;
			return format(date, "yyyy-MM-dd HH:mm:ss");
		},
	},
	{
		accessorKey: "roles",
		header: "Roles",
		cell: ({ row }) => {
			let roles = null;
			roles = (row.getValue("roles") as string[]) ?? null;
			if (roles) {
				return roles.map((role) => capitalizeFirstLetter(role)).join(", ");
			} else {
				return "";
			}
		},
	},
	{
		accessorKey: "classes",
		header: "Classes",
		cell: ({ row }) => {
			let classes = null;
			classes = (row.getValue("classes") as string[]) ?? null;
			if (classes) {
				return classes.join(", ");
			} else {
				return <small className="text-opacity-20">N/A</small>;
			}
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const account = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
