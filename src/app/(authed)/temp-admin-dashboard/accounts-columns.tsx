"use client";

import { rolesInfo } from "@/app/(authed)/data";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountItem } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schema for edit form
const editAccountSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
});

// Dummy data. To be replace by real values from the server.
export const accounts: AccountItem[] = [
	{
		id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
		firstName: "Luke",
		lastName: "Exodus",
		email: "helloworld@gmail.com",
		dateCreated: new Date("2025-05-20T10:00:00Z"),
		dateModified: new Date("2025-05-20T10:00:00Z"),
		roles: ["student"],
		classes: ["Javascript Basics", "Data Structures & Algorithms"],
	},
	{
		id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
		firstName: "Mia",
		lastName: "Galvez",
		email: "mia.galvez@example.com",
		dateCreated: new Date("2025-05-01T08:00:00Z"),
		dateModified: new Date("2025-05-10T09:00:00Z"),
		roles: ["student"],
		classes: ["Intro to Python", "Algorithms 101"],
	},
	{
		id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
		firstName: "Jose",
		lastName: "Ramirez",
		email: "jose.ramirez@example.com",
		dateCreated: new Date("2025-03-15T12:00:00Z"),
		dateModified: new Date("2025-04-01T14:00:00Z"),
		roles: ["teacher", "admin"],
		classes: ["Javascript Basics", "Advanced C++"],
	},
	{
		id: "d4e5f6g7-h8i9-0123-defg-456789012345",
		firstName: "Ava",
		lastName: "Delos Santos",
		email: "ava.ds@example.com",
		dateCreated: new Date("2025-02-20T09:30:00Z"),
		dateModified: new Date("2025-05-20T11:00:00Z"),
		roles: ["student"],
		classes: ["UX Design", "Data Structures & Algorithms"],
	},
	{
		id: "e5f6g7h8-i9j0-1234-efgh-567890123456",
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@adminmail.com",
		dateCreated: new Date("2024-12-12T07:45:00Z"),
		dateModified: new Date("2025-01-01T10:00:00Z"),
		roles: ["admin"],
	},
	{
		id: "f6g7h8i9-j0k1-2345-fghi-678901234567",
		firstName: "Bianca",
		lastName: "Yu",
		email: "bianca.yu@example.com",
		dateCreated: new Date("2025-04-04T15:00:00Z"),
		dateModified: new Date("2025-05-01T16:30:00Z"),
		roles: ["teacher"],
		classes: ["Data Structures & Algorithms"],
	},
	{
		id: "g7h8i9j0-k1l2-3456-ghij-789012345678",
		firstName: "Caleb",
		lastName: "Reyes",
		email: "caleb.reyes@example.com",
		dateCreated: new Date("2025-01-20T06:00:00Z"),
		dateModified: new Date("2025-04-30T09:15:00Z"),
		roles: ["student"],
		classes: ["Intro to Python"],
	},
	{
		id: "h8i9j0k1-l2m3-4567-hijk-890123456789",
		firstName: "Lana",
		lastName: "Martinez",
		email: "lana.martinez@example.com",
		dateCreated: new Date("2025-03-01T13:20:00Z"),
		dateModified: new Date("2025-03-20T14:50:00Z"),
		roles: ["teacher"],
		classes: ["Frontend Development", "Javascript Basics"],
	},
	{
		id: "i9j0k1l2-m3n4-5678-ijkl-901234567890",
		firstName: "Nathan",
		lastName: "Lee",
		email: "nathan.lee@example.com",
		dateCreated: new Date("2025-02-18T11:00:00Z"),
		dateModified: new Date("2025-04-10T10:00:00Z"),
		roles: ["admin"],
	},
	{
		id: "j0k1l2m3-n4o5-6789-jklm-012345678901",
		firstName: "Chloe",
		lastName: "Lim",
		email: "chloe.lim@example.com",
		dateCreated: new Date("2025-03-12T08:30:00Z"),
		dateModified: new Date("2025-03-30T09:00:00Z"),
		roles: ["student"],
		classes: ["Advanced C++", "Intro to Python"],
	},
	{
		id: "k1l2m3n4-o5p6-7890-klmn-123456789012",
		firstName: "Marco",
		lastName: "Santiago",
		email: "marco.santiago@example.com",
		dateCreated: new Date("2025-04-15T07:00:00Z"),
		dateModified: new Date("2025-04-25T08:00:00Z"),
		roles: ["student"],
		classes: ["Frontend Development"],
	},
	{
		id: "l2m3n4o5-p6q7-8901-lmno-234567890123",
		firstName: "Grace",
		lastName: "Tan",
		email: "grace.tan@example.com",
		dateCreated: new Date("2025-05-01T13:00:00Z"),
		dateModified: new Date("2025-05-10T14:30:00Z"),
		roles: ["teacher"],
		classes: ["UX Design"],
	},
	{
		id: "m3n4o5p6-q7r8-9012-mnop-345678901234",
		firstName: "Ethan",
		lastName: "Yap",
		email: "ethan.yap@example.com",
		dateCreated: new Date("2025-01-10T10:00:00Z"),
		dateModified: new Date("2025-03-10T11:00:00Z"),
		roles: ["admin"],
	},
	{
		id: "n4o5p6q7-r8s9-0123-nopq-456789012345",
		firstName: "Sofia",
		lastName: "Navarro",
		email: "sofia.navarro@example.com",
		dateCreated: new Date("2025-04-20T12:00:00Z"),
		dateModified: new Date("2025-05-01T12:30:00Z"),
		roles: ["student"],
		classes: ["UX Design"],
	},
	{
		id: "o5p6q7r8-s9t0-1234-opqr-567890123456",
		firstName: "Zion",
		lastName: "Rivera",
		email: "zion.rivera@example.com",
		dateCreated: new Date("2025-02-01T14:00:00Z"),
		dateModified: new Date("2025-04-01T16:00:00Z"),
		roles: ["teacher"],
		classes: ["Algorithms 101", "Javascript Basics"],
	},
	{
		id: "p6q7r8s9-t0u1-2345-pqrs-678901234567",
		firstName: "Elijah",
		lastName: "Castro",
		email: "elijah.castro@example.com",
		dateCreated: new Date("2025-01-15T10:00:00Z"),
		dateModified: new Date("2025-03-10T11:00:00Z"),
		roles: ["student"],
		classes: ["Javascript Basics", "Intro to Python"],
	},
	{
		id: "q7r8s9t0-u1v2-3456-qrst-789012345678",
		firstName: "Isabelle",
		lastName: "Santos",
		email: "isabelle.santos@example.com",
		dateCreated: new Date("2025-02-20T14:30:00Z"),
		dateModified: new Date("2025-05-01T08:15:00Z"),
		roles: ["teacher"],
		classes: ["Data Structures & Algorithms", "Frontend Development"],
	},
	{
		id: "r8s9t0u1-v2w3-4567-rstu-890123456789",
		firstName: "Noah",
		lastName: "Velasquez",
		email: "noah.velasquez@example.com",
		dateCreated: new Date("2024-11-30T09:00:00Z"),
		dateModified: new Date("2025-01-10T10:30:00Z"),
		roles: ["admin"],
	},
	{
		id: "s9t0u1v2-w3x4-5678-stuv-901234567890",
		firstName: "Hannah",
		lastName: "Lorenzo",
		email: "hannah.lorenzo@example.com",
		dateCreated: new Date("2025-04-01T13:00:00Z"),
		dateModified: new Date("2025-05-01T14:20:00Z"),
		roles: ["student"],
		classes: ["UX Design"],
	},
	{
		id: "t0u1v2w3-x4y5-6789-tuvw-012345678901",
		firstName: "Gabriel",
		lastName: "Chavez",
		email: "gabriel.chavez@example.com",
		dateCreated: new Date("2025-03-12T07:30:00Z"),
		dateModified: new Date("2025-04-15T08:45:00Z"),
		roles: ["teacher"],
		classes: ["Advanced C++", "Algorithms 101"],
	},
	{
		id: "u1v2w3x4-y5z6-7890-uvwx-123456789012",
		firstName: "Leah",
		lastName: "Padilla",
		email: "leah.padilla@example.com",
		dateCreated: new Date("2025-02-25T10:30:00Z"),
		dateModified: new Date("2025-03-20T11:00:00Z"),
		roles: ["admin"],
	},
	{
		id: "v2w3x4y5-z6a7-8901-vwxy-234567890123",
		firstName: "Isaac",
		lastName: "Garcia",
		email: "isaac.garcia@example.com",
		dateCreated: new Date("2025-01-10T12:00:00Z"),
		dateModified: new Date("2025-01-30T12:45:00Z"),
		roles: ["student"],
		classes: ["Data Structures & Algorithms"],
	},
	{
		id: "w3x4y5z6-a7b8-9012-wxyz-345678901234",
		firstName: "Emily",
		lastName: "Reyes",
		email: "emily.reyes@example.com",
		dateCreated: new Date("2025-03-01T09:15:00Z"),
		dateModified: new Date("2025-03-25T10:10:00Z"),
		roles: ["teacher"],
		classes: ["Intro to Python"],
	},
	{
		id: "x4y5z6a7-b8c9-0123-xyza-456789012345",
		firstName: "Calvin",
		lastName: "Mendoza",
		email: "calvin.mendoza@example.com",
		dateCreated: new Date("2025-04-10T16:00:00Z"),
		dateModified: new Date("2025-05-05T17:00:00Z"),
		roles: ["student"],
		classes: ["Frontend Development"],
	},
	{
		id: "y5z6a7b8-c9d0-1234-yzab-567890123456",
		firstName: "Diana",
		lastName: "Villanueva",
		email: "diana.villanueva@example.com",
		dateCreated: new Date("2024-12-01T08:00:00Z"),
		dateModified: new Date("2025-01-05T09:00:00Z"),
		roles: ["admin"],
	},
	{
		id: "z6a7b8c9-d0e1-2345-zabc-678901234567",
		firstName: "Lucas",
		lastName: "Delgado",
		email: "lucas.delgado@example.com",
		dateCreated: new Date("2025-02-15T11:00:00Z"),
		dateModified: new Date("2025-04-01T12:00:00Z"),
		roles: ["student"],
		classes: ["UX Design", "Advanced C++"],
	},
	{
		id: "a7b8c9d0-e1f2-3456-abcd-789012345678",
		firstName: "Zara",
		lastName: "Torres",
		email: "zara.torres@example.com",
		dateCreated: new Date("2025-03-20T10:00:00Z"),
		dateModified: new Date("2025-05-01T11:30:00Z"),
		roles: ["teacher"],
		classes: ["Javascript Basics"],
	},
	{
		id: "b8c9d0e1-f2g3-4567-bcde-890123456789",
		firstName: "Nathaniel",
		lastName: "Cruz",
		email: "nathaniel.cruz@example.com",
		dateCreated: new Date("2025-01-25T07:30:00Z"),
		dateModified: new Date("2025-03-01T08:30:00Z"),
		roles: ["admin", "teacher"],
	},
	{
		id: "c9d0e1f2-g3h4-5678-cdef-901234567890",
		firstName: "Faith",
		lastName: "Lopez",
		email: "faith.lopez@example.com",
		dateCreated: new Date("2025-02-10T14:00:00Z"),
		dateModified: new Date("2025-03-15T15:00:00Z"),
		roles: ["student"],
		classes: ["Algorithms 101", "Frontend Development"],
	},
	{
		id: "d0e1f2g3-h4i5-6789-defg-012345678901",
		firstName: "Xander",
		lastName: "Lim",
		email: "xander.lim@example.com",
		dateCreated: new Date("2025-04-01T09:00:00Z"),
		dateModified: new Date("2025-04-20T09:30:00Z"),
		roles: ["teacher", "admin"],
		classes: ["UX Design", "Intro to Python"],
	},
];

export const accountColumns: ColumnDef<AccountItem>[] = [
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
			const { dateCreated: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "dateModified",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Modified" />,
		cell: ({ row }) => {
			const { dateModified: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "roles",
		header: "Role",
		cell: ({ row }) => {
			const { roles } = row.original;
			if (roles) {
				return (
					<span className="flex flex-row flex-wrap gap-2">
						{roles.map((role) => (
							<Badge variant="outline" key={role}>
								{rolesInfo.find((_) => _.value === role)?.icon} {capitalizeFirstLetter(role)}
							</Badge>
						))}
					</span>
				);
			} else {
				return "";
			}
		},
	},
	{
		accessorKey: "classes",
		header: "Classes",
		cell: ({ row }) => {
			const { classes } = row.original;
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

			// Add form hook for edit dialog
			const form = useForm<z.infer<typeof editAccountSchema>>({
				resolver: zodResolver(editAccountSchema),
				defaultValues: {
					firstName: account.firstName,
					lastName: account.lastName,
					email: account.email,
				},
			});

			function onSubmit(values: z.infer<typeof editAccountSchema>) {
				console.log(values);
				// Handle form submission - to be implemented
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Dialog>
							<DialogTrigger asChild>
								<DropdownMenuItem onSelect={(event) => event.preventDefault()}>Edit</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit account</DialogTitle>
									<DialogDescription>
										Make changes to your account here. Click save when you&apos;re done.
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											void form.handleSubmit(onSubmit)(e);
										}}
										className="grid gap-4 py-4">
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<DialogFooter>
											<Button type="submit">Save changes</Button>
										</DialogFooter>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
									Delete
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure you want to delete this account?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete your account and remove your data from
										our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction>Delete</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
