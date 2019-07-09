import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";
import PopupView from "./popupView";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const filterOptions = [
			{id: "1", value: _("All")},
			{id: "2", value: _("Overdue")},
			{id: "3", value: _("Completed")},
			{id: "4", value: _("Today")},
			{id: "5", value: _("Tomorrow")},
			{id: "6", value: _("This week")},
			{id: "7", value: _("This month")}
		];

		return {
			type: "section",
			borderless: true,
			rows: [
				{
					cols: [
						{
							view: "segmented",
							localId: "activitiesFilter",
							value: 1,
							options: filterOptions,
							gravity: 4,
							on: {
								onChange: () => {
									this.$$("activities").filterByAll();
								}
							}
						},
						{},
						{
							view: "button",
							localId: "add",
							label: _("Add activity"),
							type: "icon",
							icon: "mdi mdi-plus-box",
							css: "webix_primary",
							click: () => {
								this.window.showWindow("Add");
							}
						}
					]
				},
				{
					view: "datatable",
					localId: "activities",
					css: "table_outline",
					scroll: "auto",
					select: true,
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: [_("Activity type"), {content: "richSelectFilter"}], options: activityTypes, sort: "string", fillspace: true},
						{id: "DueDate", header: [_("Due date"), {content: "dateRangeFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: [_("Details"), {content: "textFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "ContactID", header: [_("Contact"), {content: "richSelectFilter"}], options: contacts, sort: "string", fillspace: true},
						{id: "editActivity", header: "", width: 50, template: "<span class='mdi mdi-file-document-edit edit_entry'></span>"},
						{id: "deleteActivity", header: "", width: 50, template: "<span class='mdi mdi-trash-can delete_entry'></span>"}
					],
					onClick: {
						delete_entry: (e, id) => {
							webix.confirm({
								title: _("Delete this entry"),
								text: _("Are you sure you want to delete this entry?"),
								ok: _("OK"),
								cancel: _("Cancel")
							}).then(() => {
								activities.remove(id);
							});
							return false;
						},
						edit_entry: (e, id) => {
							this.window.showWindow("Edit", id);
							return false;
						}
					}
				}
			]
		};
	}

	init() {
		this.$$("activities").sync(activities, () => {
			this.$$("activities").filterByAll();
		});
		this.window = this.ui(PopupView);

		activities.waitData.then(() => {
			this.$$("activities").registerFilter(
				this.$$("activitiesFilter"), {
					compare(value, filter, item) {
						const convFilter = parseInt(filter);
						const date = item.DueDate;
						const taskMonth = webix.Date.monthStart(date);
						const taskDay = webix.Date.dayStart(date);
						const taskWeek = webix.Date.weekStart(date);
						const current = new Date();
						const currentMonth = webix.Date.monthStart(current);
						const currentWeek = webix.Date.weekStart(current);
						const currentDay = webix.Date.dayStart(current);
						const tomorrow = webix.Date.add(webix.Date.dayStart(current), 1, "day");
						if (convFilter === 1) {
							return date;
						}
						if (convFilter === 2) {
							return date < current && item.State === "Open";
						}
						if (convFilter === 3) {
							return item.State === "Close";
						}
						if (convFilter === 4) {
							return webix.Date.equal(currentDay, taskDay) &&
							item.State === "Open";
						}
						if (convFilter === 5) {
							return webix.Date.equal(taskDay, tomorrow) &&
							item.State === "Open";
						}
						if (convFilter === 6) {
							return webix.Date.equal(taskWeek, currentWeek) &&
							item.State === "Open";
						}
						if (convFilter === 7) {
							return webix.Date.equal(taskMonth, currentMonth) &&
							item.State === "Open";
						}
						return item;
					}
				},
				{
					getValue(node) {
						return node.getValue();
					},
					setValue(node, value) {
						node.setValue(value);
					}
				}
			);
		});
	}
}
