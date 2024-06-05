const Foto = require('./domain/foto');


const axios = require('axios');

class DataManager {

    url = "http://localhost:8080"

    static async loadImages(sourcePath) {
        try {
            const response = await axios.get(`${this.url}/images`, { data: { sourcePath } });
            const images = response.data.map(imageInfo =>{
                new Foto(imageInfo)
            })
            return images
        } catch (error) {
            console.error('Error loading images:', error);
            throw error;
        }
    }

    static async saveImages(inputPath, outputPath) {
        try {
            await axios.post(`${this.url}/images`, { inputPath, outputPath });
        } catch (error) {
            console.error('Error saving images:', error);
            throw error;
        }
    }
}

module.exports = DataManager;
