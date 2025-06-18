'use strict';

const navToggler = document.querySelector('#toggler');
const sidebarOverlay = document.querySelector('#sidebar-overlay');
const sidebarBtn = document.querySelector('#sidebar-btn');
const btnReadMore = document.querySelector('#read-more');
const btnShowMore = document.querySelector('#show-more');
const imgTargets = document.querySelectorAll('img[data-src]');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');

const imagesObj = {
  // prettier-ignore
  sicily: ['IMG_4930','IMG_6801','IMG_9125','IMG_4916','IMG_4445','IMG_1720','IMG_4145','IMG_4140','IMG_1340','IMG_3844'],
  animals: ['IMG_9000', 'IMG_9039', 'IMG_8907'],
  // prettier-ignore
  bristol: ['IMG_8254','IMG_3312','IMG_3318','IMG_3283','IMG_1218','IMG_5130','IMG_3942','IMG_4773','IMG_0261','IMG_0266','IMG_3345','IMG_0256','IMG_4659', 'IMG_4629','IMG_1701'],
  // prettier-ignore
  cookie: ['IMG_0092','IMG_0018','IMG_0085','IMG_0113','IMG_0527','IMG_0545','IMG_0376','IMG_0397','IMG_0302'],
  london: ['IMG_5238', 'IMG_5304', 'IMG_5320', 'IMG_5339'],
  // prettier-ignore
  macro: ['IMG_7753','IMG_1267','IMG_1413','IMG_1610','IMG_8402','IMG_7569','IMG_0858','IMG_8344','IMG_0151','IMG_8370','IMG_8392','IMG_0829','IMG_8434','IMG_9060','IMG_9099','IMG_9093'],
  kira: ['IMG_4936', 'IMG_4935', 'IMG_9621', 'IMG_1856'],
  timelapse: ['Castellammare', 'grisi', 'Palermo'],
};

class App {
  curSlide = 0;
  maxSlides;

  constructor() {
    navToggler.addEventListener('click', this.sideBar.bind(this));
    sidebarOverlay.addEventListener('click', this.sideBar.bind(this));
    sidebarBtn.addEventListener('click', this.sideBar.bind(this));
    document.addEventListener('keydown', this.keyDown.bind(this));
  }

  observerSections(object) {
    const observer = new IntersectionObserver(object, {
      root: null,
      threshold: 0,
      rootMargin: '200px',
    });
    return observer;
  }

  observerHead(object) {
    const observer = new IntersectionObserver(object, {
      root: null,
      threshold: 0,
    });
    return observer;
  }

  lazyImgObserver(object) {
    //folders
    const observer = new IntersectionObserver(object, {
      root: null,
      threshold: 0,
      rootMargin: '50px',
    });
    return observer;
  }

  revealSection(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section-hidden');
    observer.unobserve(entry.target);
  }

  hideSection() {
    const allSections = document.querySelectorAll('section');

    allSections.forEach(section => {
      this.observerSections(this.revealSection).observe(section);
      section.classList.add('section-hidden');
    });
  }

  lazyImg(target, observer) {
    target.forEach(img => {
      observer(this.loadImg).observe(img);
      img.classList.add('lazy-img');
    });
  }

  loadImg(entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      entry.target.src = entry.target.dataset.src;

      entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
      });
      observer.unobserve(entry.target);
    });
  }

  hideIMG() {
    const allShowcaseIMG = document.querySelectorAll('.showcase-img');

    allShowcaseIMG.forEach(img => {
      this.observerSections(this.revealIMG).observe(img);
      img.classList.add('section-hidden');
    });
  }

  revealIMG(entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      entry.target.classList.remove('section-hidden');
      observer.unobserve(entry.target);
    });
  }

  hideHeadP2() {
    const headP2 = document.getElementById('head-p2');

    this.observerHead(this.revealSection).observe(headP2);
    headP2.classList.add('section-hidden');
  }

  sideBar() {
    const sidebar = document.querySelector('#sidebar');
    const sidebarBody = document.querySelector('#sidebar-body');

    sidebar.classList.toggle('slide-sidebar');
    sidebarOverlay.classList.toggle('slide-sidebar-overlay');

    sidebarBody
      .querySelectorAll('a')
      .forEach(btn => btn.addEventListener('click', this.sideBar.bind(this)));
  }

  keyDown(e) {
    if (e.key === 'Escape' && !sidebar.classList.contains('slide-sidebar'))
      this.sideBar();
  }

  readMore() {
    const aboutContent = document.getElementById('about-content');

    aboutContent.classList.toggle('show-content');
    btnReadMore.textContent === 'READ MORE'
      ? (btnReadMore.textContent = 'HIDE')
      : (btnReadMore.textContent = 'READ MORE');
  }

  showMore() {
    window.location = 'folders.html';
  }

  goToSlide(object, slide) {
    this.maxSlides = object.length;
    object.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  nextSlide(object) {
    if (this.curSlide === this.maxSlides - 1) {
      this.curSlide = 0;
    } else {
      this.curSlide++;
    }
    this.goToSlide(object, this.curSlide);
  }

  prevSlide(object) {
    if (this.curSlide === 0) {
      this.curSlide = this.maxSlides - 1;
    } else {
      this.curSlide--;
    }
    this.goToSlide(object, this.curSlide);
  }
}

class Index extends App {
  constructor() {
    super();

    btnReadMore.addEventListener('click', this.readMore.bind(this));
    btnShowMore.addEventListener('click', this.showMore.bind(this));
    btnRight.addEventListener('click', this.nextSlide.bind(this, slides));
    btnLeft.addEventListener('click', this.prevSlide.bind(this, slides));

    this.hideSection();
    this.hideIMG();
    this.hideHeadP2();
    this.goToSlide(slides, 0);
    this.lazyImg(imgTargets, this.observerSections);
  }
}

class Folder extends App {
  constructor() {
    super();
    this.lazyImg(imgTargets, this.lazyImgObserver);
    this.numberPhotos();
  }

  numberPhotos() {
    const foldersIMGH3 = document.querySelectorAll('.folder-image-h3');

    foldersIMGH3.forEach(el => {
      const internalFolder = el
        .querySelector('h3')
        .textContent.toLowerCase()
        .split(' ')[0];
      const folderP = el.querySelector('p');
      folderP.textContent = `${imagesObj[internalFolder].length} Photos`;
    });
  }
}

class Gallery extends App {
  galleryIMG = document.querySelector('.gallery-head-img');
  galleryBody = document.querySelector('#gallery-body');
  galleryHeadNumPictures = document.querySelector('.gallery-head-num-pictures');
  galleryHeadDescription = document.querySelector('.gallery-head-description');
  folder = location.search.substring(1);
  slideModal = '';
  modal = document.querySelector('.modal');
  modalBody = document.querySelector('#modal-body');
  overlay = document.querySelector('.overlay');
  btnCloseModal = document.querySelector('.close-modal');

  constructor() {
    super();
    this.imgGallery();
    this.setWidthIMGGalleryBody();
    this.videoTimelapse();

    this.galleryBody.addEventListener('click', this.openModal.bind(this));
    this.btnCloseModal.addEventListener('click', this.closeModal.bind(this));
    btnRight.addEventListener(
      'click',
      this.nextSlide.bind(this, this.slideModal)
    );
    btnLeft.addEventListener(
      'click',
      this.prevSlide.bind(this, this.slideModal)
    );
  }

  imgGallery() {
    const string = `img/${this.folder}/${imagesObj[this.folder][0]}`;

    if (!this.folder in imagesObj || this.folder === 'timelapse') return;

    //Gallery Head URL
    document
      .querySelector(`.gallery-head-description-${this.folder}`)
      .classList.remove('hide');
    this.galleryIMG.style.backgroundImage = `url('${string}.webp')`;

    //Gallery Head Num Pictures
    this.galleryHeadNumPictures.textContent = `${
      imagesObj[this.folder].length
    } Photos`;

    this.createHTMLstring();
    this.slideModal = document.querySelectorAll('.slideModal');
  }

  videoTimelapse() {
    if (this.folder in imagesObj && this.folder === 'timelapse') {
      this.galleryIMG.classList.add('hide');
      document.querySelector('.iframe').classList.remove('hide');
    }
  }

  createHTMLstring() {
    let imgTargetBody;

    imagesObj[this.folder].forEach((el, ind) => {
      const string = `img/${this.folder}/${el}`;

      //Gallery Body URL
      let htmlString = `
        <div><img src="${string}x.webp" data-src="${string}.webp" 
        data-index="${ind}" alt="" onContextMenu="return false" /></div>`;

      this.insertIMGGalleryBodyModal(this.galleryBody, htmlString);

      htmlString = `
      <img class="slideModal" src="${string}.webp"
      data-index="${ind}" alt="" onContextMenu="return false" />`;

      this.insertIMGGalleryBodyModal(this.modalBody, htmlString);
    });

    imgTargetBody = document.querySelectorAll('img[data-src]');
    this.slideModal = document.querySelectorAll('.slideModal');

    this.lazyImg(imgTargetBody, this.lazyImgObserver);
  }

  insertIMGGalleryBodyModal(recipient, html) {
    recipient.insertAdjacentHTML('beforeend', html);
  }

  setWidthIMGGalleryBody() {
    const divs = this.galleryBody.querySelectorAll('div');
    const images = this.galleryBody.querySelectorAll('img');
    // console.log(images[8].clientWidth, images[8].clientHeight);
    // console.log(images[9].clientWidth, images[9].clientHeight);
    // console.log(images[10].clientWidth, images[10].clientHeight);

    // let totImageWidth = 0;
    // images.forEach(img => {
    //   //console.log(img.clientWidth, img.clientHeight);
    //   totImageWidth += img.clientWidth;
    // });
    // totImageWidth = totImageWidth / images.length;
    // console.log(images.length);
    // console.log('Media:', Math.floor(totImageWidth));

    // divs.forEach(div => {
    //   div.classList.add('horizontal-image');
    //   console.log(div.clientWidth);
    //   // if (div.clientWidth > totImageWidth) {
    //   //   console.log('in');
    //   //   div.classList.remove('horizontal-image');
    //   //   div.classList.add('vertical-image');
    //   // }

    //   //console.log(images[ind].clientWidth, images[ind].clientHeight);
    //   //console.log(el.clientWidth, el.clientHeight);
    //   // console.log(el.width, el.height);
    // });
  }

  openModal(e) {
    this.modal.classList.toggle('hidden');
    this.overlay.classList.remove('hidden');

    this.curSlide = Number(e.target.dataset.index);
    this.goToSlide(this.slideModal, this.curSlide);
  }

  closeModal() {
    this.modal.classList.toggle('hidden');
    this.overlay.classList.add('hidden');
  }
}

if (
  document.URL === 'https://maxdevelopment.epizy.com/' ||
  document.URL === 'http://maxdevelopment.epizy.com/' ||
  document.URL.includes('?i=1') ||
  document.URL.includes('index.html')
) {
  console.log('index');
  const index = new Index();
}

if (document.URL.includes('folders')) {
  console.log('folders');
  const folder = new Folder();
}

if (document.URL.includes('gallery')) {
  console.log('gallery');
  const galley = new Gallery();
}
