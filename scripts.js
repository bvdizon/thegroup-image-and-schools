const schoolsContainer = document.getElementById('schools');
const imagesContainer = document.getElementById('images');
const chooseCommunityForm = document.getElementById('chooseCommunityForm');
const communityList = document.getElementById('communityList');

// Display Schools from fetched data
const displaySchools = (arr) => {
	arr.forEach((school) => {
		const {
			school: name,
			address,
			phone: tel,
			type,
			programs,
			grade,
			about1,
			about2,
			about3,
			website,
			cre_url: logo
		} = school;

		let schoolTemplate = `   
        <h3>${name}</h3>
        <pre>         
        &lt;div class=&quot;school&quot;&gt;
            &lt;h4&gt;${name}&lt;/h4&gt;
            &lt;p&gt;${address}&lt;/p&gt;
            &lt;p&gt;Tel: ${tel}&lt;/p&gt;
            &lt;div class=&quot;school--details&quot;&gt;
                &lt;div&gt;
                    &lt;p&gt;&lt;strong&gt;Type: &lt;/strong&gt;${type}&lt;/p&gt;
                    &lt;p&gt;&lt;strong&gt;Programs: &lt;/strong&gt;${programs}&lt;/p&gt;
                    &lt;p&gt;&lt;strong&gt;Grades: &lt;/strong&gt;${grade}&lt;/p&gt;
                &lt;/div&gt;
                &lt;div&gt;
                    &lt;div class=&quot;img-container tooltip&quot; data-tooltip=&quot;${about1 +
						' ' +
						about2 +
						' ' +
						about3}&quot;&gt;
                        &lt;a href=&quot;${website}&quot; target=&quot;_blank&quot; rel=&quot;nofollow noindex noreferrer&quot;&gt;
                            &lt;img class=&quot;lazyload&quot; data-src=&quot;${logo}&quot; alt=&quot;${name}&quot;&gt;
                        &lt;/a&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;&lt;!-- @end of .school --&gt; 
        </pre>
        <hr>`;

		if (schoolsContainer) {
			schoolsContainer.innerHTML += schoolTemplate;
		}
	});
};

// Display Images from fetched data
const displayImages = (cmty, data) => {
	document.getElementById('images').innerHTML = '';
	const filteredImages = data.filter((image) => image.community === cmty);

	filteredImages.sort((a, b) => b.filename - a.filename).forEach((img) => {
		const { image_caption, image_cre, filename } = img;

		let html = `
        <div class="image-markup-grid">
            <div>
                <h3 style="text-align:center;">${filename}</h3>
                <img src="${image_cre}">
            </div>
            <div>
            <pre>
&lt;a href=&quot;${image_cre}&quot; data-gallery=&quot;gallery1&quot; class=&quot;glightbox&quot; rel=&quot;noindex nofollow&quot;&gt;
    &lt;img class=&quot;lazyload&quot; data-src=&quot;${image_cre}&quot; alt=&quot;${image_caption}&quot;&gt;
&lt;/a&gt;
            </pre>
            </div>        
        </div>
        <hr>
        `;

		document.getElementById('images').innerHTML += html;
	});
};

// Get schools from file
const getSchools = async () => {
	const response = await fetch('schools.json');
	const data = await response.json();
	return data;
};

// Get images from json file
const getImages = async () => {
	const response = await fetch('images.json');
	const data = await response.json();
	return data;
};

// Call the function getSchools
getSchools().then((data) => displaySchools(data)).catch((err) => console.log(err.message));

getImages()
	.then((data) => {
		// map the array first, then create a set with unique values
		let setCommunities = new Set(data.map((item) => item.community));
		Array.from(setCommunities).sort().forEach((cmtyName) => {
			let html = `<option value="${cmtyName}">${cmtyName}</option>`;
			communityList.innerHTML += html;
		});

		// Listen to the submitted form
		chooseCommunityForm.addEventListener('submit', (e) => {
			e.preventDefault();
			displayImages(communityList.value, data);
		});
	})
	.catch((err) => console.log(err.message));
