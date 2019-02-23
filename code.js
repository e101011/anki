const input = document.querySelector('.words');
const hint = document.querySelector('.hint');
const notFountBlock = document.querySelector('.not-found');

document.querySelector('.words').addEventListener('input', (e) => {
	if (e.target.textContent.length) {
		hint.classList.add('hide');
	} else {
		hint.classList.remove('hide');
	}
});

document.querySelector('button.new-search').addEventListener('click', () => {
	notFountBlock.classList.add('hide');
	notFountBlock.querySelector('.list').innerHTML = '';
	hint.classList.remove('hide');
});

document.querySelector('button.download').addEventListener('click', () => {
	let file = '';
	const dictionary = [];
	const noMatches = [];
	const allWords = input.innerText.split('\n').filter(word => word);

	[...allWords].map(word => {
		word = word.replace(/\s/g, '+');

		let wordDetails = {word};

		function setWordData() {
			return fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word}`)
				.then(res => res.json())
				.then(res => {
					res = res[0];
					if (!res) {
						noMatches.push(word);

						return;
					}
					const meaning = res.meanings
						.map(item => `${item.translation.text} [${item.partOfSpeechCode}]</br>`)
						.join('')
						.replace(/<\/br>$/, '');

					dictionary.push({
						word: res.text,
						transcription: res.meanings[0].transcription,
						meaning: meaning,
						audio: res.meanings[0].soundUrl
					});

					downloadAudio(res.meanings[0].soundUrl, res.text);
				});
		}

		function generateTextFile() {
			dictionary.map(item => {
				const {word, meaning, transcription} = item;

				const text = `${word};${meaning};${transcription};[sound:anki_${word.replace(' ', '_')}.mp3]`;
				file = file + `${text}\n`;
			});
		}

		function downloadAudio(soundUrl, title) {
			fetch(`https://cors-anywhere.herokuapp.com/https:${soundUrl}`)
				.then((res) => res.blob())
				.then((res) => {
					const url = window.URL.createObjectURL && window.URL.createObjectURL(new Blob([res], {
						type: 'audio/mpeg'
					}));
					const link = document.createElement('a');
					link.setAttribute('href', url);
					link.setAttribute('Download', `anki_${title.replace(' ', '_')}.mp3`);
					link.click();
				})
		}

		function downloadDictionary(filename, text) {
			const element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', filename);
			element.click();
		}


		Promise.all([setWordData()]).then(() => {
			if ((dictionary.length + noMatches.length) === allWords.length) {
				generateTextFile();

				downloadDictionary('anki_dictionary', file);

				input.textContent = '';

				if (noMatches.length) {
					notFountBlock.classList.remove('hide');
					notFountBlock.querySelector('.list').innerHTML = noMatches.join(', ');
				} else {
					hint.classList.remove('hide');
				}
			}
		});
	})
});
