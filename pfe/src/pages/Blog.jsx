import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample AI models data
  const aiModels = [
    {
      id: 1,
      title: 'HealthMate ',
      category: 'Natural Language Processing',
      date: '10 Feb 2025',
      image: '/src/assets/images/blog/blog-02.png',
      description: 'Advanced text generation model capable of creating human-like content for various applications.'
    },
    {
      id: 2,
      title: 'LawGenius ',
      category: 'Computer Vision',
      date: '08 Feb 2025',
      image: '/src/assets/images/blog/blog-10.png',
      description: 'LawGenius is an intelligent chatbot designed to help you navigate the world of law with ease'
    },
    {
      id: 3,
      title: 'Ai-rt',
      category: 'Natural Language Processing',
      date: '05 Feb 2025',
      image: '/src/assets/images/blog/blog-11.png',
      description: 'ArtGenius is an intelligent chatbot designed to inspire and assist in the world of digital and traditional art.'
    },
   
    {
      id: 4,
      title: 'TechSage',
      category: 'Data Science',
      date: '25 Jan 2025',
      image: '/src/assets/images/blog/blog-06.png',
      description: ' is a cutting-edge chatbot designed to keep you informed and assist you in the ever-evolving world of technology.'
    }
  ];

  // Filter models based on search term
  const filteredModels = aiModels.filter(model => 
    model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categories for sidebar
  const categories = [
    { name: 'Health', count: 1 },
    { name: 'Art', count: 1 },
    { name: 'tech', count: 1 },
    { name: 'law', count: 1 },
    
  ];

  return (
    <>
      {/* Breadcrumb Area */}
      <div className="main-content">
        <div className="breadcrumb-area breadcarumb-style-1 pt--180 pb--100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-inner text-center">
                  <h3 className="title h3">AI Models</h3>
                  <ul className="page-list">
                    <li className="rainbow-breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="rainbow-breadcrumb-item active">AI Models</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Area */}
      <div className="rainbow-blog-area rainbow-section-gap bg-color-1">
        <div className="container">
          <div className="row row--30">
            <div className="col-lg-8">
              <div className="row mt_dec--30">
                <div className="col-lg-12">
                  <div className="row row--15">
                    {filteredModels.map(model => (
                      <div className="col-lg-6 col-md-6 col-12 mt--30" key={model.id}>
                        <div className="rainbow-card">
                          <div className="inner">
                            <div className="thumbnail">
                              <Link className="image" to={`/blog/${model.id}`}>
                                <img src={model.image} alt={model.title} />
                              </Link>
                            </div>
                            <div className="content">
                              <ul className="rainbow-meta-list">
                                <li><i className="fa-sharp fa-regular fa-calendar-days icon-left"></i> {model.date}</li>
                                <li className="separator"></li>
                                <li className="catagory-meta"><Link to="#">{model.category}</Link></li>
                              </ul>
                              <h4 className="title">
                                <Link to={`/blog/${model.id}`}>{model.title}</Link>
                              </h4>
                              <p className="description">{model.description}</p>
                              <Link className="btn-read-more border-transparent" to={`/blog/${model.id}`}>
                                <span>View Model <i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4 mt_md--40 mt_sm--40">
              <aside className="rainbow-sidebar">
                <div className="rbt-single-widget widget_search mt--40">
                  <div className="inner">
                    <form className="blog-search" onSubmit={(e) => e.preventDefault()}>
                      <input 
                        type="text" 
                        placeholder="Search AI Models..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="search-button">
                        <i className="feather-search"></i>
                      </button>
                    </form>
                  </div>
                </div>

                <div className="rbt-single-widget widget_categories mt--40">
                  <h3 className="title">Categories</h3>
                  <div className="inner">
                    <ul className="category-list">
                      {categories.map((category, index) => (
                        <li key={index}>
                          <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setSearchTerm(category.name);
                          }}>
                            <span className="left-content">{category.name}</span>
                            <span className="count-text">{category.count}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

               

                <div className="rbt-single-widget widget_tag_cloud mt--40">
                  <h3 className="title">Tags</h3>
                  <div className="inner">
                    <div className="tagcloud">
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('AI')}}>AI</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('Machine Learning')}}>Machine Learning</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('NLP')}}>NLP</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('Vision')}}>Vision</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('Speech')}}>Speech</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('Analytics')}}>Analytics</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('Data')}}>Data</a>
                      <a href="#" onClick={(e) => {e.preventDefault(); setSearchTerm('Recognition')}}>Recognition</a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;