import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ContactInfo from "./contacts/contactInfo";
import ContactsForm from "./contacts/contactsForm";

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
								contacts.add({FirstName: "John", LastName: "Doe", StatusID: 1});
								this.app.callEvent("addContact", [null, "Add"]);
								webix.$$("test2").show(false, false);
							}
						}
					]
				},
				{cells: [
					{$subview: ContactInfo, id: "test1"},
					{$subview: ContactsForm, id: "test2"}
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

			contactsList.data.attachEvent("onIdChange", () => {
				contactsList.select(contacts.getLastId());
			});

			contacts.attachEvent("onAfterDelete", () => {
				contactsList.select(contacts.getFirstId());
			});

			if (!contacts.exists(id)) {
				contactsList.select(contacts.getFirstId());
			}
			else if (id && id !== contactsList.getSelectedId()) {
				contactsList.select(id);
			}

			const placeholder = "http://diazworld.com/images/avatar-placeholder.png";
			this.$$("photoPreview").setValues(placeholder);
		});
	}
}

// TODO: refactor contacts.js
