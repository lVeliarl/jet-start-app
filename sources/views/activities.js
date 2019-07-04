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
			rows: [
				{cols: [
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
							this.window.showWindow(null, "Add");
						}
					}
				]},
				{
					view: "datatable",
					localId: "activities",
					select: true,
					columns: [
						{id: "State", header: "", template: "{common.checkbox()}", checkValue: "Close", uncheckValue: "Open", width: 50},
						{id: "TypeID", header: [_("Activity type"), {content: "richSelectFilter"}], options: activityTypes, sort: "string", fillspace: true},
						{id: "convertedDate", header: [_("Due date"), {content: "dateRangeFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}], sort: "date", width: 150, format: webix.i18n.longDateFormatStr},
						{id: "Details", header: [_("Details"), {content: "multiComboFilter"}], template: "#Details#", fillspace: true, sort: "string"},
						{id: "ContactID", header: [_("Contact"), {content: "richSelectFilter"}], options: contacts, sort: "string", fillspace: true},
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
		activities.filter();
		this.$$("activities").sync(activities);
		this.window = this.ui(PopupView);

		activities.waitData.then(() => {
			this.$$("activities").registerFilter(
				this.$$("activitiesFilter"), {
					columnId: "convertedDate",
					compare(value, filter, item) {
						const convFilter = parseInt(filter);
						const taskYear = value.getFullYear();
						const taskMonth = value.getMonth();
						const taskDay = value.getDay();
						const currentYear = new Date().getFullYear();
						const currentMonth = new Date().getMonth();
						const currentDay = new Date().getDay();
						const formatToStr = webix.Date.dateToStr("%Y-%m-%d");
						function currentWeek() {
							let curr = new Date();
							let week = [];

							for (let i = 1; i <= 7; i++) {
								let first = curr.getDate() - curr.getDay() + i;
								let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
								week.push(day);
							}
							return week.includes(formatToStr(value));
						}
						if (convFilter === 1) {
							return value;
						}
						if (convFilter === 2) {
							return value < new Date() && item.State === "Open";
						}
						if (convFilter === 3) {
							return value < new Date() && item.State === "Close";
						}
						if (convFilter === 4) {
							return taskYear === currentYear &&
							taskMonth === currentMonth &&
							taskDay === currentDay;
						}
						if (convFilter === 5) {
							return taskYear === currentYear &&
							taskMonth === currentMonth &&
							taskDay === currentDay + 1;
						}
						if (convFilter === 6) {
							return currentWeek();
						}
						if (convFilter === 7) {
							return taskYear === currentYear &&
							taskMonth === currentMonth;
						}
						return value;
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
