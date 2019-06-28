import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ActivitiesTable from "./contacts/activitiesTable";
import FilesTable from "./contacts/filesTable";

export default class ContactsView extends JetView {
	config() {
		const htmlContactsCard =
		`<div class='wrapper card'>
			<div class='row'>
				<div class='column'>
					<img src='http://diazworld.com/images/avatar-placeholder.png' width='50' height='50'>
				</div>
				<div class='column'>
				#FirstName# #LastName# <br> #Company#
				</div>
			</div>
		</div>`;

		const htmlContactsInfo =
		`<div class='wrapper info'>
			<div class='row row1'>
				<div class='column column1'>
					<h2 class='contacts_name'>#FirstName# #LastName# </h2>
				</div>
			</div>
			<div class='row row2'>
				<div class='column column1'>
					<span class='photo'></span>
					<h4 class='label'>Status</h4>
				</div>
				<div class='column column2'>
					<span class='mdi mdi-email'>#Email#</span>
					<span class='mdi mdi-skype'>#Skype#</span>
					<span class='mdi mdi-tag'>#Job#</span>
					<span class='mdi mdi-briefcase'>#Company#</span>
				</div>
				<div class='column column3'>
					<span class='mdi mdi-calendar-month'>#Birthday#</span>
					<span class='mdi mdi-map-marker'>#Address#</span>
				</div>
			</div>
		</div>`;

		const contactsList = {
			view: "list",
			localId: "contacts",
			width: 220,
			select: true,
			scroll: "auto",
			template: htmlContactsCard,
			borderless: true,
			type: {
				width: "auto",
				height: "auto"
			},
			on: {
				onAfterSelect: (id) => {
					this.setParam("id", id, true);
				}
			}
		};

		return {
			cols: [
				{
					rows: [
						contactsList,
						{
							view: "button",
							type: "icon",
							icon: "mdi mdi-plus-box",
							label: "Add contact",
							css: "webix_primary",
							click: () => {
								contacts.add({FirstName: "John", LastName: "Doe"});
							}
						}
					]
				},
				{cells: [
					{rows: [
						{
							cols: [
								{
									template: htmlContactsInfo,
									localId: "contactsInfo",
									borderless: true
								},
								{rows: [
									{cols: [
										{
											view: "button",
											label: "Delete",
											css: "webix_primary",
											type: "icon",
											icon: "mdi mdi-trash-can",
											click: () => {
												let id = this.getParam("id");
												this.webix.confirm({
													title: "Delete this contact",
													text: "Do yo really want to remove this contatct?"
												}).then(() => {
													contacts.remove(id);
												});
											}
										},
										{
											view: "button",
											label: "Edit",
											css: "webix_primary",
											type: "icon",
											icon: "mdi mdi-file-document-edit",
											click: () => {
												this.$$("test2").show();
											}
										}
									],
									width: 200},
									{}
								]}
							]
						},
						{
							view: "segmented",
							multiview: true,
							options: [
								{id: "activitiesSwitch", value: "Activities"},
								{id: "filesSwitch", value: "Files"}
							]
						},
						{
							cells: [
								{$subview: ActivitiesTable, id: "activitiesSwitch"},
								{$subview: FilesTable, id: "filesSwitch"}
							]
						}
					],
					id: "test1"},
					{id: "test2"}
				]
				}
			],
			type: "section"
		};
	}

	init() {
		let contactsList = this.$$("contacts");

		contactsList.sync(contacts);
		this.$$("contactsInfo").bind(contactsList);

		contacts.waitData.then(() => {
			let id = this.getParam("id");

			if (!contacts.exists(id)) {
				contactsList.select(contacts.getFirstId());
			}
			else if (id && contacts.exists(id)) {
				contactsList.select(id);
			}
		});
	}
}

// multiview: contatcts info | edit / add contact form
// multiview: activities / files
// files: handle file saving
