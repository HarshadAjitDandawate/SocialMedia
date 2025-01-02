const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const reportModel = require('../models/report-model');
const userModel = require('../models/user-model');
const isLoggedin = require('../middleware/isLoggedin');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
            const fn = bytes.toString("hex") + path.extname(file.originalname)
            return cb(null, fn)
        })
    }
});

const upload = multer({ storage });

router.get('/', isLoggedin, async (req, res) => {
    try {
        const reports = await reportModel.find({ user: req.user._id });
        res.render('quick-report', { reports });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while fetching reports');
        res.redirect('/');
    }
});

router.post('/upload', isLoggedin, upload.single('csvFile'), async (req, res) => {
    try {
        const { datasetName, description } = req.body;
        const filePath = req.file.path;

        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                const newReport = new reportModel({
                    name: datasetName,
                    description,
                    filePath,
                    data: results,
                    user: req.user._id
                });

                await newReport.save();

                await userModel.findByIdAndUpdate(req.user._id, {
                    $push: { reports: newReport._id }
                });

                req.flash('success', 'Report uploaded successfully');
                res.redirect('/quick-report');
            });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while uploading the report');
        res.redirect('/quick-report');
    }
});

router.get('/report/:id', isLoggedin, async (req, res) => {
    try {
        const report = await reportModel.findById(req.params.id);
        if (!report || report.user.toString() !== req.user._id.toString()) {
            req.flash('error', 'Report not found');
            return res.redirect('/quick-report');
        }
        res.render('report', { report });
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while fetching the report');
        res.redirect('/quick-report');
    }
});

router.get('/:id/delete', isLoggedin, async (req, res) => {
    try {
        const report = await reportModel.findById(req.params.id);
        if (!report || report.user.toString() !== req.user._id.toString()) {
            req.flash('error', 'Report not found');
            return res.redirect('/quick-report');
        }

        // Delete the file from the filesystem
        fs.unlink(report.filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        await reportModel.findByIdAndDelete(req.params.id);

        req.flash('success', 'Report deleted successfully');
        res.redirect('/quick-report');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while deleting the report');
        res.redirect('/quick-report');
    }
});

module.exports = router;
