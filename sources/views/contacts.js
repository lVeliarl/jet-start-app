import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ContactInfo from "./contacts/contactsInfo";
import ContactsForm from "./contacts/contactsForm";
import {placeholder} from "../helpers/placeholder";

export default class ContactsView extends JetView {
	config() {
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
				],
				animate: false
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
			let pageMode = this.getParam("mode");

			if (!contacts.exists(id)) {
				contactsList.select(contacts.getFirstId());
			}

			if (!pageMode) {
				this.setParam("mode", "info", true);
			}

			if (pageMode === "info") {
				this.$$("top:contactsInfo").show();
			}

			if (pageMode === "form") {
				this.$$("top:contactsForm").show();
			}
		});

		this.on(this.app, "editContact", (mode) => {
			this.setParam("mode", "form", true);
			if (mode === "Add") {
				contactsList.unselectAll();
			}
			this.$$("top:contactsForm").show();
		});

		this.on(this.app, "editCancel", () => {
			this.setParam("mode", "info", true);
			this.$$("top:contactsInfo").show();
		});
	}

	urlChange() {
		let contactsList = this.$$("contacts");
		contacts.waitData.then(() => {
			let id = this.getParam("id");
			let pageMode = this.getParam("mode");

			if (!id && pageMode !== "form") {
				this.setParam("id", contacts.getFirstId(), true);
			}

			if (id && !contacts.exists(id) && contacts.exists(contacts.getFirstId())) {
				this.setParam("id", contacts.getFirstId(), true);
			}

			if (id && id !== contactsList.getSelectedId() && contacts.exists(id)) {
				contactsList.select(id);
				contactsList.showItem(id);
			}
		});
	}
}

