import React from 'react'
import { motion } from "framer-motion";
import MenuSliderProducts from './MenuSliderProducts'
import MenuSliderCategories from './MenuSliderCategories'
import MenuSlide375 from '../../../assets/images/landing/menu-slider/section-eight-375.webp'
import MenuSlide700 from '../../../assets/images/landing/menu-slider/section-eight-700.webp'
import MenuSlide900 from '../../../assets/images/landing/menu-slider/section-eight-900.webp'
import MenuSlide1025 from '../../../assets/images/landing/menu-slider/section-eight-1025.webp'
import MenuSlide1440 from '../../../assets/images/landing/menu-slider/section-eight-1440.webp'
import { menuSliderCategories, menuSliderProducts } from '../../../data/menuSliderContent';
import './menu-slider.css'


export default class MenuSlider extends React.Component {
  constructor() {
    super()
    this.state = {
      activeCategory: 'pizza',
      allProducts: [],
      allCategories: [],
    }
    this.getAllProducts = this.getAllProducts.bind(this)
    this.changeCategory = this.changeCategory.bind(this)
    this.getProductsByCategory = this.getProductsByCategory.bind(this)
  }
  allCategoriesData = new Promise((resolve, reject) => {
    if (true) {
      resolve(menuSliderCategories)
      return
    }
    reject('error, check the code!')
  })
  allProductsData = new Promise((resolve, reject) => {
    if (true) {
      resolve(menuSliderProducts)
      return
    }
    reject('error, check the code!')
  })
  getCategories() {
    try {
      const result = this.allCategoriesData
      this.setState({ allCategories: result })
    } catch (error) {
      console.log(error)
    }
  }
  getAllProducts() {
    try {
      const result = this.allProductsData
      this.setState({ allProducts: result })
    } catch (error) {
      console.log(error)
    }
  }
  changeCategory(newCategory) {
    this.setState({ activeCategory: newCategory })
    this.getProductsByCategory(newCategory)
  }
  getProductsByCategory(category) {
    let separateCategoriesByname = []
    //Separate arrays by category names

    const separateCategories = menuSliderProducts.reduce(function (
      singleCategory,
      singleItem,
    ) {
      separateCategoriesByname = Object.keys(singleCategory)

      if (!singleCategory[singleItem.category])
        singleCategory[singleItem.category] = singleItem
      else
        singleCategory[singleItem.category] = Array.isArray(
          singleCategory[singleItem.category],
        )
          ? singleCategory[singleItem.category].concat(singleItem)
          : [singleCategory[singleItem.category]].concat(singleItem)

      return singleCategory
    },
      {})

    const productsOfCategories = Object.keys(separateCategories).map(
      (e) => separateCategories[e],
    )

    let singleCategoryArray = []
    productsOfCategories.map((category) => {
      return singleCategoryArray.push(category)
    })

    //Change products by category
    separateCategoriesByname.forEach((cate) => {
      if (cate === category) {
        return this.setState({ allProducts: separateCategories[category] })
      }
    })
  }
  componentDidMount() {
    this.getAllProducts()
    this.getProductsByCategory(this.state.activeCategory)
  }

  render() {
    const { allProducts } = this.state
    return (
      <article className="section-8">
        <motion.div
          className="section-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
        >
          <picture className='menu-slider-hero'>
            <source srcSet={MenuSlide1440} media='(min-width: 1440px)' />
            <source srcSet={MenuSlide1025} media='(min-width: 1025px)' />
            <source srcSet={MenuSlide900} media='(min-width: 900px)' />
            <source srcSet={MenuSlide700} media='(min-width: 700px)' />
            <img src={MenuSlide375} alt='Restaurant interior' className='menu-slider-hero' width={375} height={281} loading='lazy' />
          </picture>
          <section className="dish-slider  flex-container flex-column txt-center">
            <section className="dish-categories flex-container flex-column">
              <ul>
                {menuSliderCategories.map((category) => (
                  <MenuSliderCategories
                    key={category.id}
                    category={category}
                    changeCategory={this.changeCategory}
                  />
                ))}
              </ul>
            </section>
            <section className="menu-slider-products">
              {allProducts.map((singleProduct) => {
                return (
                  <MenuSliderProducts
                    key={singleProduct.id}
                    singleProduct={singleProduct}
                  />
                )
              })}
            </section>
          </section>
        </motion.div>
      </article>
    )
  }
}