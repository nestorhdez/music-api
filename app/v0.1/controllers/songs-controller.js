const SongModel = require('../models/songs-model')

const getSongs = (req, res) => {
    return SongModel.find()
        .then(allSongs => res.json({data: allSongs}))
        .catch(err => res.status(400).json(err))
}

const getSongById = (req, res) => {
    let songId = req.params.id;
    return SongModel.findById(songId)
        .then( song => res.json({data: song}))
        .catch(err => res.status(404).json(err))
}

const postSong = (req, res) => {
    let newSong = new SongModel(req.body)
    return newSong.save()
        .then(() => res.json({data: newSong}))
        .catch(err => res.status(400).json(err))
}

const editSong = (req, res) => {
    let {title, autor, video} = req.body;
    return SongModel.findByIdAndUpdate(req.params.id, {title, autor, video}, {new: true, runValidators: true})
        .then(song => res.json({data: song}))
        .catch(err => res.status(400).json(err))
}

const deleteSong = (req, res) => {
    return SongModel.findOneAndDelete({_id: req.params.id})
        .then(() => res.send(`${req.params.id} has been successfully deleted`))
        .catch(err => res.status(400).json(err))
}

module.exports = {
    getSongs,
    getSongById,
    postSong,
    editSong,
    deleteSong
}