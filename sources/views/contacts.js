import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ContactInfo from "./contacts/contactsInfo";
import ContactsForm from "./contacts/contactsForm";
import {placeholder} from "../helpers/placeholder";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
						{
							view: "text",
							localId: "contactFilter",
							placeholder: _("type to find matching contacts"),
							css: "contact_filter",
							on: {
								onTimedKeyPress() {
									let value = this.getValue().toLowerCase();
									contacts.filter((obj) => {
										const filterValues = [obj.FirstName, obj.LastName, obj.Company].join("|");
										return filterValues.toLowerCase().indexOf(value) !== -1;
									});
								}
							}
						},
						contactsList,
						{
							view: "button",
							type: "icon",
							icon: "mdi mdi-plus-box",
							label: _("Add contact"),
							css: "webix_primary",
							click: () => {
								this.app.callEvent("editContact", ["Add"]);
								this.setParam("id", "", true);
								this.setParam("mode", "form", true);
							}
						}
					]
				},
				{cells: [
					{rows: [{$subview: ContactInfo}], localId: "info"},
					{rows: [{$subview: ContactsForm}], localId: "form"}
				],
				animate: false
				}
			],
			type: "section",
			borderless: true
		};
	}

	init() {
		let contactsList = this.$$("contacts");

		contactsList.sync(contacts);

		this.on(this.app, "editContact", (mode) => {
			if (mode === "Add") {
				this.show("/top/contacts?mode=form");
				contactsList.unselectAll();
			}
			else {
				this.setParam("mode", "form", true);
			}
		});

		this.on(this.app, "editCancel", () => {
			this.setParam("mode", "info", true);
		});
	}

	urlChange() {
		let contactsList = this.$$("contacts");
		contacts.waitData.then(() => {
			let id = this.getParam("id");
			let pageMode = this.getParam("mode");

			if (!pageMode) {
				this.setParam("mode", "info", true);
			}

			if (!id || !contacts.exists(id)) {
				if (pageMode !== "form") {
					id = contacts.getFirstId();
				}
				else {
					id = null;
				}
			}

			if (id) {
				contactsList.select(id);
				contactsList.showItem(id);
			}

			this.$$(pageMode).show();
		});
	}
}

