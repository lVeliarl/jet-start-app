import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const htmlContactsInfo =
		`<div class='wrapper'>
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
							template: htmlContactsInfo,
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
