import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ActivitiesTable from "./contacts/activitiesTable";
import FilesTable from "./contacts/filesTable";
import {statuses} from "../models/statuses";

export default class ContactsView extends JetView {
	config() {
		const placeholder = "http://diazworld.com/images/avatar-placeholder.png";

		const contactsList = {
			view: "list",
			localId: "contacts",
			width: 220,
			select: true,
			scroll: "auto",
			borderless: true,
			template: obj => `<div class='wrapper card'>
				<div class='row'>
					<div class='column'>
						<img src=${obj.Photo || placeholder} width='50' height='50'>
					</div>
					<div class='column'>
					${obj.FirstName || "-"} ${obj.LastName || "-"} <br> ${obj.Company || "-"}
					</div>
				</div>
			</div>`,
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
								this.$$("editContact").setValues({FirstName: "John", LastName: "Doe"});
								this.showMenu("Add");
								this.$$("contacts").select(contacts.getLastId());
							}
						}
					]
				},
				{cells: [
					{rows: [
						{
							cols: [
								{
									template: obj => `<div class='wrapper info'>
								<div class='row row1'>
									<div class='column column1'>
										<h2 class='contacts_name'>${obj.FirstName || "-"} ${obj.LastName || "-"} </h2>
									</div>
								</div>
								<div class='row row2'>
									<div class='column column1'>
										<span class='photo'></span>
										<h4 class='label'>${obj.Status || "-"}</h4>
									</div>
									<div class='column column2'>
										<span class='mdi mdi-email'>${obj.Email || "-"}</span>
										<span class='mdi mdi-skype'>${obj.Skype || "-"}</span>
										<span class='mdi mdi-tag'>${obj.Job || "-"}</span>
										<span class='mdi mdi-briefcase'>${obj.Company || "-"}</span>
									</div>
									<div class='column column3'>
										<span class='mdi mdi-calendar-month'>${obj.Birthday || "-"}</span>
										<span class='mdi mdi-map-marker'>${obj.Address || "-"}</span>
									</div>
								</div>
							</div>`,
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
												let id = this.getParam("id");
												let item = contacts.getItem(id);
												this.$$("editContact").setValues(item);
												this.showMenu("Edit");
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
					{rows: [
						{template: "Edit (add new) contact", localId: "formHeader", height: 100},
						{cols: [
							{
								view: "form",
								localId: "editContact",
								cols: [
									{rows: [
										{
											view: "text",
											label: "First name",
											name: "FirstName"
										},
										{
											view: "text",
											label: "Last name",
											name: "LastName"
										},
										{
											view: "datepicker",
											label: "Joining date",
											name: "StartDate"
										},
										{
											view: "select",
											label: "Status",
											name: "StatusID",
											options: statuses
										},
										{
											view: "text",
											label: "Job",
											name: "Job"
										},
										{
											view: "text",
											label: "Company",
											name: "Company"
										},
										{
											view: "text",
											label: "Website",
											name: "Website"
										},
										{
											view: "text",
											label: "Address",
											name: "Address"
										},
										{}
									]},
									{rows: [
										{
											view: "text",
											label: "Email",
											name: "Email"
										},
										{
											view: "text",
											label: "Skype",
											name: "Skype"
										},
										{
											view: "text",
											label: "Phone",
											name: "Phone"
										},
										{
											view: "datepicker",
											label: "Birthday",
											name: "Birthday"
										},
										{}
									]}

								]
							}
						]},
						{cols: [
							{},
							{
								view: "button",
								value: "Cancel",
								click: () => {
									let list = this.$$("contacts");
									let form = this.$$("editContact");
									let id = this.getParam("id");
									let value = this.$$("saveContact").getValue();
									if (value === "Add") {
										contacts.remove(contacts.getLastId());
										list.select(contacts.getFirstId());
									}
									if (value === "Save") {
										list.select(id);
									}
									this.$$("test1").show(false, false);
									form.clear();
									form.clearValidation();
								}
							},
							{
								view: "button",
								value: "Save(add)",
								localId: "saveContact",
								css: "webix_primary",
								click: () => {
									let id = this.getParam("id");
									let value = this.$$("editContact").getValues();
									let form = this.$$("editContact");
									if (contacts.exists(id)) {
										contacts.updateItem(id, value);
									}
									webix.message("Entry successfully saved");
									this.$$("test1").show(false, false);
									form.clear();
									form.clearValidation();
								}
							}
						]}
					],
					id: "test2"}
				]
				}
			],
			type: "section"
		};
	}

	init() {
		let contactsList = this.$$("contacts");

		contactsList.sync(contacts);

		contacts.waitData.then(() => {
			let id = this.getParam("id");

			if (!contacts.exists(id)) {
				contactsList.select(contacts.getFirstId());
			}
			else if (id && id !== contactsList.getSelectedId()) {
				contactsList.select(id);
			}
		});
	}

	showMenu(mode) {
		let updateButton = this.$$("saveContact");
		let formHeader = this.$$("formHeader");

		if (mode === "Add") {
			formHeader.setHTML(`${mode} new contact`);
			updateButton.setValue(`${mode}`);
		}
		else if (mode === "Edit") {
			formHeader.setHTML(`${mode} contact`);
			updateButton.setValue("Save");
		}
		this.$$("test2").show(false, false);
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			let selectedContact = webix.copy(contacts.getItem(id));
			let selectedStatusID = statuses.getItem(selectedContact.StatusID);

			selectedContact.Status = selectedStatusID.Value;
			this.$$("contactsInfo").setValues(selectedContact);
		});
	}
}

// multiview: contatcts info | edit / add contact form
// multiview: activities / files
// files: handle file saving
