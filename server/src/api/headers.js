import express from "express";
import Model from "../Model";

export default class Header {
  constructor(app) {
		this.app = app;
		this.router = express.Router();

    this.router.get("/", async (req, res) => {
      Model.getHeaders()
        .then((result) => {
          res.json({ success: true, got: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
    });

    this.router.get("/:id", async (req, res) => {
      const id = req.params.id;
      Model.getHeader(id)
        .then((result) => {
          res.json({ success: true, got: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
    });

    this.router.get("/fromMonitor/:id", async (req, res) => {
      const id = req.params.id;
      Model.getHeadersOfMonitor(id)
        .then((result) => {
          res.json({ success: true, got: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
		});
		
		this.router.get("/toMonitors/:id", async (req, res) => {
			const id = req.params.id;
      Model.getMonitorsOfHeader(id)
        .then((result) => {
          res.json({ success: true, got: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
		});

    this.router.post("/", async (req, res) => {
      const header = { title: req.body.title, value: req.body.value };
      Model.createHeader(header.title, header.value)
        .then((result) => {
          res.json({ success: true, posted: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
    });

    this.router.patch("/:id", async (req, res) => {
      const id = req.params.id;
			const header = { title: req.body.title, value: req.body.value };
			const ids = await this.getMonitorsId(id);
			Model.modifyHeader(id, header.title, header.value)
        .then((result) => {
					this.updateAllLinked(ids);
          res.json({ success: true, updated: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
    });

    this.router.delete("/:id", async (req, res) => {
			const id = req.params.id;
			const ids = await this.getMonitorsId(id);
      Model.deleteHeader(id)
        .then((result) => {
					this.updateAllLinked(ids);
          res.json({ success: true, deleted: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
		});
	}
	
	async updateAllLinked(monitors_id) {
		for (const id of monitors_id) {
			this.app.checkAndReload(id);
		}
	}

	async getMonitorsId(id) {
		const array = new Array();
		for (const row of await Model.getMonitorsIDOfHeader(id)) {
			array.push(row.monitor_id);
		}
		return array;
	}
}
