"use client";

import { rolesInfo } from "@/app/(authed)/data";
import { Badge } from "@/components/ui/badge";
import { ParticipantItem } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export const participants: ParticipantItem[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440000",
		firstName: "Jose",
		lastName: "Ramirez",
		email: "jose.ramirez@example.com",
		role: "teacher",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		firstName: "Luke",
		lastName: "Exodus",
		email: "luke.exodus@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		firstName: "Jane",
		lastName: "Doe",
		email: "jane.doe@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		firstName: "John",
		lastName: "Smith",
		email: "john.smith@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440004",
		firstName: "Alice",
		lastName: "Johnson",
		email: "alice.johnson@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440005",
		firstName: "Bob",
		lastName: "Williams",
		email: "bob.williams@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440006",
		firstName: "Chloe",
		lastName: "Brown",
		email: "chloe.brown@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440007",
		firstName: "David",
		lastName: "Jones",
		email: "david.jones@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440008",
		firstName: "Emma",
		lastName: "Garcia",
		email: "emma.garcia@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440009",
		firstName: "Frank",
		lastName: "Miller",
		email: "frank.miller@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544000a",
		firstName: "Grace",
		lastName: "Martinez",
		email: "grace.martinez@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544000b",
		firstName: "Henry",
		lastName: "Davis",
		email: "henry.davis@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544000c",
		firstName: "Isabella",
		lastName: "Rodriguez",
		email: "isabella.rodriguez@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544000d",
		firstName: "Jack",
		lastName: "Lopez",
		email: "jack.lopez@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544000e",
		firstName: "Karen",
		lastName: "Gonzalez",
		email: "karen.gonzalez@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544000f",
		firstName: "Leo",
		lastName: "Wilson",
		email: "leo.wilson@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440010",
		firstName: "Mia",
		lastName: "Anderson",
		email: "mia.anderson@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440011",
		firstName: "Noah",
		lastName: "Thomas",
		email: "noah.thomas@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440012",
		firstName: "Olivia",
		lastName: "Taylor",
		email: "olivia.taylor@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440013",
		firstName: "Paul",
		lastName: "Moore",
		email: "paul.moore@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440014",
		firstName: "Quinn",
		lastName: "Jackson",
		email: "quinn.jackson@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440015",
		firstName: "Rachel",
		lastName: "Martin",
		email: "rachel.martin@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440016",
		firstName: "Steve",
		lastName: "Lee",
		email: "steve.lee@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440017",
		firstName: "Tina",
		lastName: "Perez",
		email: "tina.perez@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440018",
		firstName: "Uma",
		lastName: "Thompson",
		email: "uma.thompson@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440019",
		firstName: "Victor",
		lastName: "White",
		email: "victor.white@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544001a",
		firstName: "Wendy",
		lastName: "Harris",
		email: "wendy.harris@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544001b",
		firstName: "Xavier",
		lastName: "Sanchez",
		email: "xavier.sanchez@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544001c",
		firstName: "Yara",
		lastName: "Clark",
		email: "yara.clark@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544001d",
		firstName: "Zach",
		lastName: "Lewis",
		email: "zach.lewis@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544001e",
		firstName: "Amy",
		lastName: "Robinson",
		email: "amy.robinson@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-44665544001f",
		firstName: "Ben",
		lastName: "Walker",
		email: "ben.walker@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440020",
		firstName: "Cindy",
		lastName: "Young",
		email: "cindy.young@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440021",
		firstName: "Derek",
		lastName: "Allen",
		email: "derek.allen@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440022",
		firstName: "Elena",
		lastName: "King",
		email: "elena.king@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440023",
		firstName: "Felix",
		lastName: "Wright",
		email: "felix.wright@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440024",
		firstName: "Gina",
		lastName: "Scott",
		email: "gina.scott@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440025",
		firstName: "Harvey",
		lastName: "Green",
		email: "harvey.green@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440026",
		firstName: "Ivy",
		lastName: "Baker",
		email: "ivy.baker@example.com",
		role: "student",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440027",
		firstName: "Jay",
		lastName: "Adams",
		email: "jay.adams@example.com",
		role: "student",
	},
];

export const participantsColumns: ColumnDef<ParticipantItem>[] = [
	{
		accessorKey: "lastName",
		header: "Last Name",
	},
	{
		accessorKey: "firstName",
		header: "First Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const { role } = row.original;
			if (role) {
				return (
					<span className="flex flex-row flex-wrap gap-2">
						<Badge variant="outline" key={role}>
							{rolesInfo.find((_) => _.value === role)?.icon &&
								React.createElement(rolesInfo.find((_) => _.value === role)!.icon)}{" "}
							{role && capitalizeFirstLetter(role)}
						</Badge>
					</span>
				);
			} else {
				return "";
			}
		},
	},
];
