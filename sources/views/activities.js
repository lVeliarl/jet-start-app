import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class ActivitiesView extends JetView {
	config() {
		const filterOptions = [
			{id: "1", value: "All"},
			{id: "2", value: "Overdue"},
			{id: "3", value: "Completed"},
			{id: "4", value: "Today"},
			{id: "5", value: "Tomorrow"},
			{id: "6", value: "This week"},
			{id: "7", value: "This month"}
		];

		const popupForm = {
			view: "form",
			id: "popup_form",
			elements: [
				{view: "text", label: "Details"},
				{
					view: "select",
					label: "Type",
					options: activityTypes
				},
				{
					view: "select",
					label: "Contact",
					options: contacts
				},
				{cols: [
					{view: "datepicker", label: "Date", value: new Date()},
					{view: "datepicker", type: "time", label: "Time", value: new Date()}
				]},
				{view: "checkbox", labelRight: "Selected"},
				{cols: [
					{gravity: 4},
					{view: "button", value: "Add/delete", css: "webix_primary"},
					{view: "button", value: "Cancel"}
				]}
			]
		};

		const popup = webix.ui({
			view: "window",
			localid: "popup",
			move: true,
			head: "Edit/Add activity",
			width: 600,
			height: 400,
			position: "center",
			close: true,
			modal: true,
			body: popupForm
		});

		return {
			rows: [
				{cols: [
					{
						view: "segmented",
						value: 1,
						options: filterOptions,
						gravity: 4
					},
					{},
					{
						view: "button",
						localId: "add",
						label: "Add activity",
						type: "icon",
						icon: "mdi mdi-plus-box",
						click: () => {
							popup.show();
						}
					}
				]},
				{
					view: "datatable",
					localId: "activities",
					select: true,
					columns: [
						{id: "checkActivity", header: "", template: "{common.checkbox()}", width: 50},
						{id: "TypeID", header: ["Activity type", {content: "selectFilter"}], options: activityTypes, sort: "string"},
						{id: "DueDate", header: ["Due date", {content: "datepickerFilter"}], template: "#DueDate#", sort: "string"},
						{id: "Details", header: ["Details", {content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "ContactID", header: ["Contact", {content: "selectFilter"}], options: contacts, sort: "string"},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit'></span>"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>", css: "delete_entry"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: "Delete this entry",
								text: "Are you sure you want to delete this entry?"
							}).then(() => {
								this.$$("activities").remove(id);
							});
						}
					}
				}
			],
			type: "section"
		};
	}

	init() {
		console.log(activities);
		this.$$("activities").sync(activities);

		let config = [];

		activityTypes.waitData.then(() => {
			Object.values(activityTypes.data.pull).forEach((i) => {
				config.push(i.Value);
			});
		});
	}
}

// columns options
// select 0th option from select view
// position of checkbox with labelRight property
