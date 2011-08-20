/**
 * Athan player uses HTML5 Audio.
 * @constructor
 */
AthanPlayer = function() {
  this.audio = new Audio();
  this.track = null;
};

/**
 * List of available audio tracks that the user can choose from.
 */
AthanPlayer.AUDIO_TRACKS = {
 'Shia': [
    ['Aghati', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Aghati.mp3'],
    ['Ghelvash', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Ghelvash.mp3'],
    ['Kazem-Zadeh', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Kazem-Zadeh.mp3'],
    ['Moazzen-Zadeh Ardabili', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Moazzen-Zadeh Ardabili.mp3'],
    ['Mohammad-Zadeh', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Mohammad-Zadeh.mp3'],
    ['Rezaeian', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Rezaeian.mp3'],
    ['Rowhani-Nejad', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Rowhani-Nejad.mp3'],
    ['Salimi', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Salimi.mp3'],
    ['Sobhdel', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Sobhdel.mp3'],
    ['Tasvieh-Chi', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Tasvieh-Chi.mp3'],
    ['Tookhi', 'MP3', 'http://praytimes.org/audio/adhan/Shia/Tookhi.mp3']
  ],
  'Sunni': [
    ['Abdul-Basit', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Abdul-Basit.mp3'],
    ['Abdul-Ghaffar', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Abdul-Ghaffar.mp3'],
    ['Abdul-Hakam', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Abdul-Hakam.mp3'],
    ['Adhan Alaqsa', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Adhan Alaqsa.mp3'],
    ['Adhan Egypt', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Adhan Egypt.mp3'],
    ['Adhan Halab', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Adhan Halab.mp3'],
    ['Adhan Madina', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Adhan Madina.mp3'],
    ['Adhan Makkah', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Adhan Makkah.mp3'],
    ['Al-Hossaini', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Al-Hossaini.mp3'],
    ['Bakir Bash', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Bakir Bash.mp3'],
    ['Hafez', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Hafez.mp3'],
    ['Hafiz Murad', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Hafiz Murad.mp3'],
    ['Menshavi', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Menshavi.mp3'],
    ['Naghshbandi', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Naghshbandi.mp3'],
    ['Saber', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Saber.mp3'],
    ['Sharif Doman', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Sharif Doman.mp3'],
    ['Yusuf Islam', 'MP3', 'http://praytimes.org/audio/adhan/Sunni/Yusuf Islam.mp3']
  ]
};

/**
 * Set the Athan to a specific track for the audio stream.
 */
AthanPlayer.prototype.setAthanTrack = function(type, name) {
  var tracks = AthanPlayer.AUDIO_TRACKS[type];
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    if (name == track[0]) {
      this.track = {
        'name': name,
        'format': track[1],
        'src': track[2]
      };
      return;
    }
  }
  this.track = null;
};

/**
 * Stops  the athan which is currently in the track.
 */
AthanPlayer.prototype.stopAthan = function() {
  this.audio.pause();
};
