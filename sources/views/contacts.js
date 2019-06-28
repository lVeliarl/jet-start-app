import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

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
						<img src=${obj.Photo || obj.Placeholder} width='50' height='50'>
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
				contactsList,
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
