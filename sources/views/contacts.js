import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const contactsList = {
			view: "list",
			localId: "contacts",
			width: 200,
			select: true,
			scroll: "auto",
			template: "#FirstName# #LastName# <br> #Company#",
			type: {
				height: 60
			},
			on: {
				onAfterSelect: (id) => {
					this.setParam("id", id, true);
				}
			}
		};

		return {
			cols: [
				contactsList,
				{
					cols: [
						{
							template: "#FirstName# #LastName# <br> #Email# #Skype# <br> #Job# #Company# <br> #Birthday# #Address#",
							localId: "contactsInfo",
							borderless: true
						},
						{rows: [
							{cols: [
								{view: "button", label: "Delete", css: "webix_primary", type: "icon", icon: "mdi mdi-trash-can"},
								{view: "button", label: "Edit", css: "webix_primary", type: "icon", icon: "mdi mdi-file-document-edit"}
							],
							width: 200},
							{}
						]}
					]
				}
				// info
			],
			type: "section"
		};
	}

	init() {
		console.log(contacts);
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
