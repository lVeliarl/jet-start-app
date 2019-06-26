import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";
import PopupView from "./popupView";

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
						css: "webix_primary",
						click: (item) => {
							this.ui(PopupView).showWindow(item, "add");
						}
					}
				]},
				{
					view: "datatable",
					localId: "activities",
					select: true,
					columns: [
						{id: "checkActivity", header: "", template: "{common.checkbox()}", checkValue: "Completed", uncheckValue: "Uncompleted", width: 50},
						{id: "TypeID", header: ["Activity type", {content: "richSelectFilter"}], options: activityTypes, sort: "string"},
						{id: "DueDate", header: ["Due date", {content: "datepickerFilter"}], template: "#DueDate#", sort: "string", width: 150},
						{id: "Details", header: ["Details", {content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "ContactID", header: ["Contact", {content: "selectFilter"}], options: contacts, sort: "string"},
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
							// this.app.callEvent("formData", [item]);
							// console.log(this.ui(PopupView).getRoot().getChildViews()[1]);
							// this.ui(PopupView).getRoot().getChildViews()[1].setValues(item);
							this.ui(PopupView).showWindow(item, "edit");
						}
					},
					on: {
						onAfterSelect: (obj) => {
							this.setParam("id", obj.id, true);
						}
					}
				}
			],
			type: "section"
		};
	}

	init() {
		this.$$("activities").sync(activities);
	}

	urlChange() {
		// if (id) {
		// 	this.$$("activities").select(id);
		// }
	}
}
