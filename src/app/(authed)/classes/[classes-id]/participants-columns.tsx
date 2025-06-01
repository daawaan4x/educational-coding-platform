/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { rolesInfo } from "@/app/(authed)/data";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { ParticipantItem } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const participants: ParticipantItem[] = [
	{ firstName: "Jose", lastName: "Ramirez", email: "jose.ramirez@example.com", roles: ["teacher", "admin"] },
	{ firstName: "Luke", lastName: "Exodus", email: "luke.exodus@example.com", roles: ["student"] },
	{ firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", roles: ["student"] },
	{ firstName: "John", lastName: "Smith", email: "john.smith@example.com", roles: ["student"] },
	{ firstName: "Alice", lastName: "Johnson", email: "alice.johnson@example.com", roles: ["student"] },
	{ firstName: "Bob", lastName: "Williams", email: "bob.williams@example.com", roles: ["student"] },
	{ firstName: "Chloe", lastName: "Brown", email: "chloe.brown@example.com", roles: ["student"] },
	{ firstName: "David", lastName: "Jones", email: "david.jones@example.com", roles: ["student"] },
	{ firstName: "Emma", lastName: "Garcia", email: "emma.garcia@example.com", roles: ["student"] },
	{ firstName: "Frank", lastName: "Miller", email: "frank.miller@example.com", roles: ["student"] },
	{ firstName: "Grace", lastName: "Martinez", email: "grace.martinez@example.com", roles: ["student"] },
	{ firstName: "Henry", lastName: "Davis", email: "henry.davis@example.com", roles: ["student"] },
	{ firstName: "Isabella", lastName: "Rodriguez", email: "isabella.rodriguez@example.com", roles: ["student"] },
	{ firstName: "Jack", lastName: "Lopez", email: "jack.lopez@example.com", roles: ["student"] },
	{ firstName: "Karen", lastName: "Gonzalez", email: "karen.gonzalez@example.com", roles: ["student"] },
	{ firstName: "Leo", lastName: "Wilson", email: "leo.wilson@example.com", roles: ["student"] },
	{ firstName: "Mia", lastName: "Anderson", email: "mia.anderson@example.com", roles: ["student"] },
	{ firstName: "Noah", lastName: "Thomas", email: "noah.thomas@example.com", roles: ["student"] },
	{ firstName: "Olivia", lastName: "Taylor", email: "olivia.taylor@example.com", roles: ["student"] },
	{ firstName: "Paul", lastName: "Moore", email: "paul.moore@example.com", roles: ["student"] },
	{ firstName: "Quinn", lastName: "Jackson", email: "quinn.jackson@example.com", roles: ["student"] },
	{ firstName: "Rachel", lastName: "Martin", email: "rachel.martin@example.com", roles: ["student"] },
	{ firstName: "Steve", lastName: "Lee", email: "steve.lee@example.com", roles: ["student"] },
	{ firstName: "Tina", lastName: "Perez", email: "tina.perez@example.com", roles: ["student"] },
	{ firstName: "Uma", lastName: "Thompson", email: "uma.thompson@example.com", roles: ["student"] },
	{ firstName: "Victor", lastName: "White", email: "victor.white@example.com", roles: ["student"] },
	{ firstName: "Wendy", lastName: "Harris", email: "wendy.harris@example.com", roles: ["student"] },
	{ firstName: "Xavier", lastName: "Sanchez", email: "xavier.sanchez@example.com", roles: ["student"] },
	{ firstName: "Yara", lastName: "Clark", email: "yara.clark@example.com", roles: ["student"] },
	{ firstName: "Zach", lastName: "Lewis", email: "zach.lewis@example.com", roles: ["student"] },
	{ firstName: "Amy", lastName: "Robinson", email: "amy.robinson@example.com", roles: ["student"] },
	{ firstName: "Ben", lastName: "Walker", email: "ben.walker@example.com", roles: ["student"] },
	{ firstName: "Cindy", lastName: "Young", email: "cindy.young@example.com", roles: ["student"] },
	{ firstName: "Derek", lastName: "Allen", email: "derek.allen@example.com", roles: ["student"] },
	{ firstName: "Elena", lastName: "King", email: "elena.king@example.com", roles: ["student"] },
	{ firstName: "Felix", lastName: "Wright", email: "felix.wright@example.com", roles: ["student"] },
	{ firstName: "Gina", lastName: "Scott", email: "gina.scott@example.com", roles: ["student"] },
	{ firstName: "Harvey", lastName: "Green", email: "harvey.green@example.com", roles: ["student"] },
	{ firstName: "Ivy", lastName: "Baker", email: "ivy.baker@example.com", roles: ["student"] },
	{ firstName: "Jay", lastName: "Adams", email: "jay.adams@example.com", roles: ["student"] },
];

export const participantsColumns: ColumnDef<ParticipantItem>[] = [
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
		accessorKey: "roles",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
		cell: ({ row }) => {
			let roles = null;
			roles = (row.getValue("roles") as string[]) ?? null;
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
];
