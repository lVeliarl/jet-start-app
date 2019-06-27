import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import PopupView from "./popupView";

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
					console.log(activities);
					this.$$("activities").parse(activities.getItem(id));
				}
			}
		};

		const activitiesTable = {
			rows: [
				{
					view: "datatable",
					localId: "activities",
					scroll: "auto",
					select: true,
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: ["Activity type", {content: "richSelectFilter"}], options: activityTypes, sort: "string"},
						{id: "convertedTime", header: ["Due date", {content: "datepickerFilter"}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: ["Details", {content: "multiComboFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit'></span>", css: "edit_entry"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>", css: "delete_entry"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: "Delete this entry",
								text: "Are you sure you want to delete this entry?"
							}).then(() => {
								activities.remove(id);
							});
						},
						edit_entry: (e, id) => {
							let item = activities.getItem(id);
							this.ui(PopupView).showWindow(item, "Edit");
						}
					}
				},
				{cols: [
					{gravity: 3},
					{
						view: "button",
						type: "icon",
						icon: "mdi mdi-plus-box",
						label: "Add activity",
						css: "webix_primary"
					}
				]}
			],
			id: "activitiesSwitch"
		};

		const filesTable = {
			rows: [
				{
					view: "datatable",
					localId: "files",
					scroll: "auto",
					select: true,
					columns: [
						{id: "fileName", header: "Name", template: "", fillspace: true, sort: "string"},
						{id: "changeDate", header: "Change date", template: "", width: 150, sort: "date"},
						{id: "fileSize", header: "Size", template: "", sort: "string"},
						{id: "deleteFile", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>", css: "delete_file"}
					],
					onClick: {
						delete_file: () => {
							webix.confirm({
								title: "Delete this file",
								text: "Are you sure you want to delete this file?"
							}).then(() => {
								// fileStorage.remove(id);
							});
						}
					}
				},
				{
					cols: [
						{},
						{
							view: "uploader",
							localId: "uploadFiles",
							type: "icon",
							icon: "mdi mdi-cloud-upload",
							label: "Upload file",
							css: "webix_primary",
							link: "files",
							upload: "../models/fileStorage",
							on: {
								onItemClick: () => {
									console.log(this.$$("uploadFiles").data.pull);
								}
							}
						},
						{}
					]}
			],
			id: "filesSwitch"
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
				{
					rows: [
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
												let id = this.getParam("id");
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
							cells: [activitiesTable, filesTable]
						}
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
