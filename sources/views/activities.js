import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";

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
					{view: "button", label: "Add activity", type: "icon", icon: "mdi mdi-plus-box"}
				]},
				{
					view: "datatable",
					localId: "activities",
					select: true,
					columns: [
						{id: "checkActivity", header: "", template: "{common.checkbox()}", width: 50},
						{id: "TypeID", header: ["Activity type", {content: "textFilter"}], template: "#TypeID#", collection: activityTypes, sort: "string"},
						{id: "DueDate", header: ["Due date", {content: "textFilter"}], template: "#DueDate#", sort: "string"},
						{id: "Details", header: ["Details", {content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "ContactID", header: ["Contact", {content: "textFilter"}], template: "#ContactID#", sort: "string"},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit'></span>"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>"}
					]
				}
			],
			type: "section"
		};
	}

	init() {
		console.log(activities, activityTypes);
		this.$$("activities").sync(activities);
		// this.$$("activities").sync(activityTypes);
	}
}
