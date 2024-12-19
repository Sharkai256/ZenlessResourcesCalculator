const characters = [
	{
		name: 'Ellen Joe',
		type: 'Attack',
		attribute: 'Ice',
		core: ['Ferocious Grip', 'Murderous Obituary']
	},
	{
		name: 'Qingyi',
		type: 'Stun',
		attribute: 'Electric',
		core: ['Living Drive', 'Ethereal Pursuit']
	},
	{
		name: 'Evelyn',
		type: 'Attack',
		attribute: 'Fire',
		core: ['no-leaks-1', 'no-leaks-2']
	},
	{
		name: 'Zhu Yuan',
		type: 'Attack',
		attribute: 'Ether',
		core: ['Living Drive', 'Ethereal Pursuit']
	},
	{
		name: 'Jane Doe',
		type: 'Anomaly',
		attribute: 'Physical',
		core: ['Ferocious Grip', 'Falling Fist']
	}
]

const addDOMElement = (
	elememt: Element,
	HTML: string,
	destination: Element | HTMLBodyElement | null | undefined,
	insertFirst?: boolean,
	insertBefore?: boolean,
	target?: Node
) => {
	elememt.innerHTML += HTML
	if (!insertBefore || !target) {
		if (!insertFirst) destination?.append(elememt)
		else destination?.insertBefore(elememt, destination.firstChild)
	}
	else destination?.insertBefore(elememt, target)
	return elememt
}

const calculateResources = (
	resourceInputs: HTMLInputElement[],
	coreInputs: NodeListOf<HTMLInputElement>,
	farmRow: Element
) => {
	resourceInputs.forEach((inp, i) => {
		let maxFarmLegendary = 9
		let maxFarmCommon = 60

		coreInputs.forEach((inp, i) => {
			if (inp.checked) {
				switch(i) {
					case 1:
						maxFarmCommon -= 2
						break
					case 2:
						maxFarmCommon -= 4
						break
					case 3:
						maxFarmLegendary -= 2
						maxFarmCommon -= 9
						break
					case 4:
						maxFarmLegendary -= 3
						maxFarmCommon -= 15
						break
					case 5:
						maxFarmLegendary -= 4
						maxFarmCommon -= 30
						break
					default:
				}
			}
		})
		if (!(i%2)) {
			maxFarmLegendary -= +inp.value
			farmRow.children[0].innerHTML = `<th>${maxFarmLegendary}</th>`
		}
		else {
			maxFarmCommon -= +inp.value
			farmRow.children[1].innerHTML = `<th>${maxFarmCommon}</th>`
		}
	})
}

const activateTables = () => {
	if (!characterTableBody || !characterTableHead) throw new Error('Character table does not exist')
	if (!farmTableHead || !farmTableBody) throw new Error('Farm table does not exist')

	const characterRow = characterTableBody.children[0]
	const farmRow = farmTableBody.children[0]
	const characterSelect = characterRow.querySelector('select')

	if (!characterSelect) throw new Error('Character select does not exist')
	if (!body) throw new Error('Body does not exist')

	characterSelect.addEventListener('change', () => {
		const choice = characterSelect.options.selectedIndex - 1
		const resourceCell1 = characterRow.children[5]
		const resourceCell2 = characterRow.children[6]

		body.style.backgroundImage = `url('./src/imgs/${choice}.jpg')`

		// TODO: transitional animation when switching wallpapers
		// body.style.backgroundImage = 'none'
		// body.style.backgroundColor = 'rgb(74 109 21 / .5)'

		resourceCell1.innerHTML = `<p>${characters[choice].core[0]}:</p><input type="number" size="1" min="0" max="9" value="0">`
		resourceCell2.innerHTML = `<p>${characters[choice].core[1]}:</p><input type="number" size="1" min="0" max="60" value="0">`
		farmTableHead.children[0].innerHTML = `<th>${characters[choice].core[0]}</th>`
		+ `<th>${characters[choice].core[1]}</th>`
		+ `<th>${characters[choice].attribute} Chips</th>`
		+ '<th>Golden Hamster</th>'
		+ `<th>${characters[choice].type} Seals</th>`
		+ '<th>WEngine Promo</th>'
		+ '<th>Pupple EXP</th>'
		farmRow.innerHTML = '<td>9</td><td>60</td><td>250</td><td>5</td><td>30</td><td>30</td><td>300</td>'

		// resource inputs are in separate table datas and cannot be manipulated as standart array elements
		const inputs = [...characterRow.querySelectorAll('input')]
		const resourceInputs = [inputs[11], inputs[12]]
		const coreInputs = characterRow.children[1].querySelectorAll('input')
		const skillInputs = characterRow.children[2].querySelectorAll('input')
		const levelSelect = characterRow.children[3].querySelector('select')
		const WEngineSelect = characterRow.children[4].querySelector('select')

		if (!levelSelect) throw new Error('Level selects does not exist')
		if (!WEngineSelect) throw new Error('WEngigne selects does not exist')

		skillInputs.forEach(inp => inp.addEventListener('change', () => {
			let maxFarmSkills = 250
			let goldenHamster = 5

			skillInputs.forEach(inp => {
				if (inp.checked) {
					maxFarmSkills -= 50
					goldenHamster--
				}
			})

			farmRow.children[2].innerHTML = `<td>${maxFarmSkills}</td>`
			farmRow.children[3].innerHTML = `<td>${goldenHamster}</td>`

			// TODO: improve chips calculation
			/* this is a more advanced / correct version which should be fixed / implemented later
			let mp = new Map()
			skillInputs.forEach((inp, i) => {
				inp.addEventListener('change', () => {
					if (+inp.value > 8) {
						mp.set(`input ${i}`, +inp.value)

						let acum = 0
						mp.forEach((val: number) => {
							acum += val
						})

						let maxFarmChips = 250
						maxFarmChips -= acum * 3
						farmRow.children[2].innerHTML = `<td>${maxFarmChips}</td>`
					}
				})
			}) */
		}))

		// advanced seals required only for 50, 60 lvls
		//? purpleEXP formula is incorrect and should be changed
		levelSelect.addEventListener('change', () => {
			let maxFarmLevel = 30
			const puprleEXP = 300 - +levelSelect.value * 5

			if (+levelSelect.value == 50) maxFarmLevel -= 10
			if (+levelSelect.value == 60) maxFarmLevel -= 30


			farmRow.children[4].innerHTML = `<td>${maxFarmLevel}</td>`
			farmRow.children[6].innerHTML = `<td>${puprleEXP}</td>`
		})

		// same here with promos
		WEngineSelect.addEventListener('change', () => {
			let maxFarmLevel = 30

			if (+WEngineSelect.value == 50) maxFarmLevel -= 10
			if (+WEngineSelect.value == 60) maxFarmLevel -= 30

			farmRow.children[5].innerHTML = `<td>${maxFarmLevel}</td>`
		})

		coreInputs.forEach(inp => inp.addEventListener('change', () => calculateResources(resourceInputs, coreInputs, farmRow)))
		resourceInputs.forEach(inp => inp.addEventListener('change', () => calculateResources(resourceInputs, coreInputs, farmRow)))
	})
}

const body = document.querySelector('body')
const characterTableHead = document.querySelector('#charTable')?.children[0]
const characterTableBody = document.querySelector('#charTable')?.children[1]

const farmTableHead = document.querySelector('#farmTable')?.children[0]
const farmTableBody = document.querySelector('#farmTable')?.children[1]

const guideHTML = '<h1>Zenless Zone Zero Resource Calculator</h1>'
+ '<h3>This page allows you to calculate resources required to max out chosen characters</h3>'
+ '<h3 style="white-space: pre-wrap">How to use:\n'
+ '1. Choose a character you want to max out\n'
+ '2. Fill out current upgrades and levels\n'
+ '3. Calculations are done automatically and will be shown in a table below</h3>\n'

const charHeaderHTML = '<th>Character</th>'
+ '<th>Core Upgrades</th>'
+ '<th>Skill Upgrades</th>'
+ '<th>Curernt Character Level</th>'
+ '<th>Current WEngine Level</th>'
+ '<th>Resource 1</th>'
+ '<th>Resource 2</th>'

let charOpts = `<option selected disabled></option>`
characters.forEach(c => charOpts += `<option>${c.name}</option>`)
// grave accent here because I'm not doing all that line-by-line
const charBodyHTML = `
<td>
	<select>${charOpts}</select>
</td>
<td>
	<input type="checkbox">A
	<input type="checkbox">B
	<input type="checkbox">C
	<input type="checkbox">D
	<input type="checkbox">E
	<input type="checkbox">F
</td>
<td>
	<input type="checkbox"> basic
	<input type="checkbox"> dodge
	<input type="checkbox"> special
	<input type="checkbox"> assist
	<input type="checkbox"> chain
</td>
<td>
	<select>
		<option selected disabled></option>
		<option>10</option>
		<option>20</option>
		<option>30</option>
		<option>40</option>
		<option>50</option>
		<option>60</option>
	</select>
</td>
<td>
	<select>
		<option selected disabled></option>
		<option>10</option>
		<option>20</option>
		<option>30</option>
		<option>40</option>
		<option>50</option>
		<option>60</option>
	</select>
</td>
<td>-</td>
<td>-</td>`

addDOMElement(
	document.createElement('div'),
	guideHTML,
	body,
	true
)

addDOMElement(
	document.createElement('tr'),
	charHeaderHTML,
	characterTableHead
)

addDOMElement(
	document.createElement('tr'),
	charBodyHTML,
	characterTableBody
)

addDOMElement(
	document.createElement('tr'),
	``,
	farmTableHead
)

addDOMElement(
	document.createElement('tr'),
	``,
	farmTableBody
)

activateTables()