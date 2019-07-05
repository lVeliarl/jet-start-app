import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ContactInfo from "./contacts/contactsInfo";
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
								this.app.callEvent("editContact", ["Add"]);
							}
						}
					]
				},
				{cells: [
					{rows: [{$subview: ContactInfo}], localId: "top:contactsInfo"},
					{rows: [{$subview: ContactsForm}], localId: "top:contactsForm"}
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

			if (id && id !== contactsList.getSelectedId()) {
				contactsList.select(id);
				contactsList.showItem(id);
			}
		});

		this.on(this.app, "editContact", (mode) => {
			if (mode === "Add") {
				contactsList.unselectAll();
			}
			this.$$("top:contactsForm").show(false, false);
		});

		this.on(this.app, "editCancel", () => {
			this.$$("top:contactsInfo").show(false, false);
		});
	}

	urlChange() {
		let contactsList = this.$$("contacts");
		console.log("test");
		contacts.waitData.then(() => {
			let id = this.getParam("id");

			if (id && !contactsList.exists(id)) {
				contactsList.select(contacts.getFirstId());
			}

			if (id && id !== contactsList.getSelectedId()) {
				contactsList.select(id);
				contactsList.showItem(id);
			}
		});
	}
}

