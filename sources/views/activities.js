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
							this.window.showWindow(item, "Add");
						}
					}
				]},
				{
					view: "datatable",
					localId: "activities",
					select: true,
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: ["Activity type", {content: "richSelectFilter"}], options: activityTypes, sort: "string"},
						{id: "convertedDate", header: ["Due date", {content: "dateRangeFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: ["Details", {content: "multiComboFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "ContactID", header: ["Contact", {content: "richSelectFilter"}], options: contacts, sort: "string", fillspace: true},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit edit_entry'></span>"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can delete_entry'></span>"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: "Delete this entry",
								text: "Are you sure you want to delete this entry?"
							}).then(() => {
								activities.remove(id);
							});
							return false;
						},
						edit_entry: (e, id) => {
							let item = activities.getItem(id);
							this.window.showWindow(item, "Edit");
							return false;
						}
					}
				}
			],
			type: "section"
		};
	}

	init() {
		this.$$("activities").sync(activities);
		this.window = this.ui(PopupView);
	}
}
