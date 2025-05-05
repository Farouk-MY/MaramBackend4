import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample AI models data - in a real app, this would come from an API
  const aiModels = [
    {
      id: 1,
      title: 'Text Generation AI',
      category: 'Natural Language Processing',
      date: '10 Feb 2025',
      image: '/src/assets/images/blog/blog-02.png',
      description: 'HealthMate: An Advanced AI Model for Healthcare Innovation',
      content: `
        <h2>Image Recognition for Medical Diagnosis</h2>
        
        <p>HealthMate utilizes advanced computer vision and deep learning algorithms to analyze medical images, assisting doctors in detecting diseases and abnormalities with high precision.</p>
        
        <h6>Medical Imaging Analysis:</h6>
        <p>he model can process X-rays, MRIs, CT scans, ultrasounds, and histopathological slides to detect anomalies such as tumors, fractures, infections, and degenerative conditions.</p>
        
        <ul>
          <li><strong>Disease Detection and Classification:</strong> Using Convolutional Neural Networks (CNNs) and Transformer-based vision models, HealthMate identifies patterns in medical images to diagnose conditions like pneumonia, diabetic retinopathy, and cancer.</li>
          <li><strong>Style Adaptation:</strong> Can mimic various writing styles from academic to creative, formal to conversational.</li>
          <li><strong>Multilingual Support:</strong> Generates high-quality content in over 20 languages with native-like fluency.</li>
          <li><strong>Domain Expertise:</strong> Specialized knowledge in fields like technology, medicine, law, and creative writing.</li>
        </ul>
        
        <h6>Natural Language Processing (NLP) for Medical Insights</h6>
        <p>Our model is built on a state-of-the-art architecture with the following specifications:</p>
        <ul>
          <li>175 billion parameters for complex language understanding</li>
          <li>Trained on 570GB of text data from diverse sources</li>
          <li>Context window of 8,192 tokens (approximately 6,000 words)</li>
          <li>Response latency under 500ms for standard requests</li>
        </ul>
        <p>By integrating our Text Generation AI into your workflow, 
        you can dramatically increase productivity while maintaining 
        high-quality output that's virtually indistinguishable from human-written content.</p>
      `,
      capabilities: [
        'Personalized Treatment Plans',
        ' Drug Recommendation and Interaction Warnings',
        'Health and Lifestyle Recommendations',
        
      ],
      technicalDetails: {
   
      }
    },
    {
      id: 2,
      title: 'Image Recognition Model',
      category: 'Computer Vision',
      date: '08 Feb 2025',
      image: '/src/assets/images/blog/blog-detailes-02.png',
      description: 'State-of-the-art image recognition system that can identify objects with high accuracy.',
      content: `
        <h2>Image Recognition Model: Seeing the World Through AI</h2>
        
        <p>Our Image Recognition Model represents the pinnacle of computer vision technology, capable of identifying and classifying objects, scenes, and activities within images with remarkable accuracy. This model has been trained on millions of diverse images to ensure robust performance across various scenarios.</p>
        
        <h6>Key Features:</h6>
        <p>The Image Recognition Model offers exceptional capabilities that make it suitable for a wide range of applications:</p>
        
        <ul>
          <li><strong>Object Detection:</strong> Identifies multiple objects within a single image with precise bounding boxes.</li>
          <li><strong>Scene Understanding:</strong> Recognizes environments and contexts such as "beach," "office," or "forest."</li>
          <li><strong>Facial Recognition:</strong> Detects and identifies faces with high accuracy while respecting privacy concerns.</li>
          <li><strong>Optical Character Recognition:</strong> Extracts text from images, including handwritten content.</li>
          <li><strong>Image Segmentation:</strong> Precisely outlines different objects within an image at the pixel level.</li>
        </ul>
        
        
        <p>Our model is built on a state-of-the-art architecture with the following specifications:</p>
        <ul>
          <li>Based on a modified ResNet-152 architecture with attention mechanisms</li>
          <li>Trained on over 15 million labeled images across 20,000 categories</li>
          <li>95.8% accuracy on the ImageNet benchmark</li>
          <li>Processing time under 200ms per image on standard hardware</li>
          <li>Supports images up to 4K resolution</li>
        </ul>
        
        <h6>Use Cases:</h6>
        <p>The Image Recognition Model can be applied across numerous scenarios:</p>
        <ul>
          <li>Retail inventory management and visual search</li>
          <li>Security and surveillance systems</li>
          <li>Medical imaging analysis</li>
          <li>Autonomous vehicles and robotics</li>
          <li>Content moderation for social platforms</li>
          <li>Augmented reality applications</li>
        </ul>
        
        <p>By integrating our Image Recognition Model into your systems, you can automate visual analysis tasks that previously required human intervention, significantly improving efficiency while maintaining high accuracy.</p>
      `,
      capabilities: [
        'Object detection',
        'Scene classification',
        'Facial recognition',
        'Text extraction (OCR)',
        'Image segmentation'
      ],
      technicalDetails: {
        architecture: 'Modified ResNet-152',
        accuracy: '95.8% on ImageNet',
        categories: '20,000+',
        resolution: 'Up to 4K supported',
        processingTime: '<200ms per image'
      }
    },
    {
      id: 3,
      title: 'Sentiment Analysis Engine',
      category: 'Natural Language Processing',
      date: '05 Feb 2025',
      image: '/src/assets/images/blog/blog-detailes-01.png',
      description: 'Powerful sentiment analysis tool that can determine emotions and opinions in text.',
      content: `
        <h2>Sentiment Analysis Engine: Understanding Emotions in Text</h2>
        
        <p>Our Sentiment Analysis Engine is a sophisticated natural language processing model designed to detect and classify emotions, opinions, and attitudes expressed in text. This powerful tool goes beyond basic positive/negative classification to identify nuanced emotional states and implicit sentiments.</p>
        
        <h6>Key Features:</h6>
        <p>The Sentiment Analysis Engine offers advanced capabilities that provide deep insights into textual content:</p>
        
        <ul>
          <li><strong>Multi-level Sentiment Classification:</strong> Beyond positive/negative/neutral to include fine-grained emotional states.</li>
          <li><strong>Aspect-based Analysis:</strong> Identifies sentiment toward specific aspects or features mentioned in the text.</li>
          <li><strong>Contextual Understanding:</strong> Recognizes sarcasm, irony, and implicit sentiments based on context.</li>
          <li><strong>Multilingual Support:</strong> Analyzes sentiment across 12 major languages with high accuracy.</li>
          <li><strong>Temporal Tracking:</strong> Monitors sentiment changes over time for trend analysis.</li>
        </ul>
        
        <h6>Technical Specifications:</h6>
        <p>Our model is built on a state-of-the-art architecture with the following specifications:</p>
        <ul>
          <li>BERT-based architecture fine-tuned on sentiment-labeled datasets</li>
          <li>Trained on over 100 million social media posts, reviews, and articles</li>
          <li>92% accuracy on standard sentiment benchmarks</li>
          <li>Identifies 27 distinct emotional states beyond basic sentiment</li>
          <li>Processing speed of 1000+ documents per second</li>
        </ul>
        
        <h6>Use Cases:</h6>
        <p>The Sentiment Analysis Engine can be applied across numerous scenarios:</p>
        <ul>
          <li>Brand monitoring and reputation management</li>
          <li>Customer feedback analysis</li>
          <li>Market research and competitive intelligence</li>
          <li>Social media monitoring</li>
          <li>Customer service optimization</li>
          <li>Product development feedback loops</li>
        </ul>
        
        <p>By integrating our Sentiment Analysis Engine into your analytics workflow, you can gain valuable insights into customer opinions, market trends, and brand perception that drive strategic decision-making.</p>
      `,
      capabilities: [
        'Multi-level sentiment classification',
        'Aspect-based sentiment analysis',
        'Sarcasm and irony detection',
        'Emotion recognition',
        'Temporal sentiment tracking'
      ],
      technicalDetails: {
        architecture: 'BERT-based',
        accuracy: '92% on benchmarks',
        languages: '12 supported',
        emotionalStates: '27 distinct categories',
        processingSpeed: '1000+ documents/second'
      }
    },
    {
      id: 4,
      title: 'Voice Recognition System',
      category: 'Speech Processing',
      date: '01 Feb 2025',
      image: '/src/assets/images/blog/blog-detailes-02.png',
      description: 'Advanced voice recognition model that converts spoken language into written text with high precision.',
      content: `
        <h2>Voice Recognition System: Transforming Speech to Text</h2>
        
        <p>Our Voice Recognition System represents the cutting edge of speech processing technology, capable of converting spoken language into written text with exceptional accuracy. This system has been designed to handle diverse accents, background noise, and specialized vocabulary across multiple domains.</p>
        
        <h6>Key Features:</h6>
        <p>The Voice Recognition System offers powerful capabilities that make it suitable for a wide range of applications:</p>
        
        <ul>
          <li><strong>Real-time Transcription:</strong> Converts speech to text with minimal latency for live applications.</li>
          <li><strong>Accent Recognition:</strong> Accurately processes diverse regional and international accents.</li>
          <li><strong>Noise Resilience:</strong> Maintains high accuracy even in environments with significant background noise.</li>
          <li><strong>Speaker Diarization:</strong> Distinguishes between different speakers in multi-person conversations.</li>
          <li><strong>Domain Adaptation:</strong> Specialized models for medical, legal, technical, and other professional fields.</li>
        </ul>
        
        <h6>Technical Specifications:</h6>
        <p>Our system is built on a state-of-the-art architecture with the following specifications:</p>
        <ul>
          <li>Hybrid CNN-Transformer architecture with attention mechanisms</li>
          <li>Trained on over 100,000 hours of diverse speech data</li>
          <li>Word Error Rate (WER) of just 4.8% on standard benchmarks</li>
          <li>Supports 18 languages with dialect variations</li>
          <li>Processing latency under 200ms for real-time applications</li>
        </ul>
        
        <h6>Use Cases:</h6>
        <p>The Voice Recognition System can be applied across numerous scenarios:</p>
        <ul>
          <li>Meeting and interview transcription</li>
          <li>Voice-controlled applications and devices</li>
          <li>Call center analytics and quality assurance</li>
          <li>Medical and legal documentation</li>
          <li>Accessibility solutions for hearing-impaired users</li>
          <li>Content creation and dictation</li>
        </ul>
        
        <p>By integrating our Voice Recognition System into your workflow, you can automate transcription tasks, enable voice commands, and make your applications more accessible while maintaining high accuracy and performance.</p>
      `,
      capabilities: [
        'Real-time transcription',
        'Multi-accent recognition',
        'Noise-resilient processing',
        'Speaker identification',
        'Domain-specific vocabulary'
      ],
      technicalDetails: {
        architecture: 'Hybrid CNN-Transformer',
        wordErrorRate: '4.8%',
        languages: '18 with dialect support',
        trainingData: '100,000+ hours',
        latency: '<200ms'
      }
    },
    {
      id: 5,
      title: 'Recommendation Engine',
      category: 'Machine Learning',
      date: '28 Jan 2025',
      image: '/src/assets/images/blog/blog-detailes-01.png',
      description: 'Sophisticated recommendation system that provides personalized suggestions based on user behavior.',
      content: `
        <h2>Recommendation Engine: Personalizing User Experiences</h2>
        
        <p>Our Recommendation Engine is a sophisticated machine learning system designed to deliver highly personalized suggestions across various domains. By analyzing user behavior, preferences, and contextual factors, this engine provides relevant recommendations that enhance user engagement and satisfaction.</p>
        
        <h6>Key Features:</h6>
        <p>The Recommendation Engine offers advanced capabilities that drive personalized experiences:</p>
        
        <ul>
          <li><strong>Hybrid Recommendation Approach:</strong> Combines collaborative filtering, content-based, and knowledge-based methods.</li>
          <li><strong>Real-time Personalization:</strong> Updates recommendations instantly based on current user behavior.</li>
          <li><strong>Cold Start Handling:</strong> Provides quality recommendations even for new users or items with limited data.</li>
          <li><strong>Contextual Awareness:</strong> Considers time, location, device, and other contextual factors.</li>
          <li><strong>Explainable Recommendations:</strong> Provides reasoning behind suggestions for transparency.</li>
        </ul>
        
        <h6>Technical Specifications:</h6>
        <p>Our engine is built on a state-of-the-art architecture with the following specifications:</p>
        <ul>
          <li>Neural collaborative filtering with attention mechanisms</li>
          <li>Graph neural networks for relationship modeling</li>
          <li>Reinforcement learning for optimization</li>
          <li>Processing of 10+ million user-item interactions daily</li>
          <li>Response time under 50ms for real-time recommendations</li>
        </ul>
        
        <h6>Use Cases:</h6>
        <p>The Recommendation Engine can be applied across numerous scenarios:</p>
        <ul>
          <li>E-commerce product recommendations</li>
          <li>Content streaming platforms (video, music, podcasts)</li>
          <li>News and article suggestions</li>
          <li>Job and candidate matching</li>
          <li>Travel and accommodation recommendations</li>
          <li>Educational content personalization</li>
        </ul>
        
        <p>By integrating our Recommendation Engine into your platform, you can significantly enhance user engagement, increase conversion rates, and provide a more satisfying and personalized experience for your users.</p>
      `,
      capabilities: [
        'Hybrid recommendation methods',
        'Real-time personalization',
        'Cold start problem handling',
        'Contextual recommendations',
        'Explainable AI features'
      ],
      technicalDetails: {
        architecture: 'Neural CF with GNNs',
        dataProcessing: '10M+ interactions daily',
        responseTime: '<50ms',
        scalability: 'Handles 100M+ users',
        accuracy: '87% recommendation relevance'
      }
    },
    {
      id: 6,
      title: 'Predictive Analytics Model',
      category: 'Data Science',
      date: '25 Jan 2025',
      image: '/src/assets/images/blog/blog-detailes-02.png',
      description: 'Cutting-edge predictive analytics model that forecasts future trends based on historical data.',
      content: `
        <h2>Predictive Analytics Model: Forecasting the Future</h2>
        
        <p>Our Predictive Analytics Model represents the forefront of data science technology, designed to forecast future trends, behaviors, and outcomes based on historical data patterns. This sophisticated system combines multiple statistical and machine learning techniques to deliver accurate predictions across various domains.</p>
        
        <h6>Key Features:</h6>
        <p>The Predictive Analytics Model offers powerful capabilities that enable forward-looking insights:</p>
        
        <ul>
          <li><strong>Multi-horizon Forecasting:</strong> Provides short, medium, and long-term predictions with confidence intervals.</li>
          <li><strong>Anomaly Detection:</strong> Identifies unusual patterns that may indicate opportunities or risks.</li>
          <li><strong>Scenario Analysis:</strong> Evaluates multiple potential futures based on different assumptions.</li>
          <li><strong>Causal Inference:</strong> Distinguishes correlation from causation for more actionable insights.</li>
          <li><strong>Automated Feature Engineering:</strong> Discovers relevant variables and transformations automatically.</li>
        </ul>
        
        <h6>Technical Specifications:</h6>
        <p>Our model is built on a state-of-the-art architecture with the following specifications:</p>
        <ul>
          <li>Ensemble approach combining time series models, gradient boosting, and deep learning</li>
          <li>Bayesian optimization for hyperparameter tuning</li>
          <li>Handles structured and unstructured data inputs</li>
          <li>Processing capacity of 1TB+ of historical data</li>
          <li>Average prediction accuracy of 92% across benchmarked use cases</li>
        </ul>
        
        <h6>Use Cases:</h6>
        <p>The Predictive Analytics Model can be applied across numerous scenarios:</p>
        <ul>
          <li>Financial forecasting and risk assessment</li>
          <li>Demand planning and inventory optimization</li>
          <li>Predictive maintenance for equipment and infrastructure</li>
          <li>Healthcare outcome prediction</li>
          <li>Customer churn prevention</li>
          <li>Resource allocation and capacity planning</li>
        </ul>
        
        <p>By integrating our Predictive Analytics Model into your decision-making processes, you can anticipate future trends, mitigate risks, and capitalize on opportunities before they fully materialize, providing a significant competitive advantage.</p>
      `,
      capabilities: [
        'Time series forecasting',
        'Anomaly detection',
        'Scenario modeling',
        'Causal inference',
        'Automated feature discovery'
      ],
      technicalDetails: {
        architecture: 'Ensemble ML/DL',
        accuracy: '92% average',
        dataCapacity: '1TB+',
        forecastHorizons: 'Short to long-term',
        updateFrequency: 'Real-time to daily'
      }
    }
  ];

  useEffect(() => {
    // Find the model with the matching ID
    const foundModel = aiModels.find(m => m.id === parseInt(id));
    
    if (foundModel) {
      setModel(foundModel);
    } else {
      // Redirect to blog page if model not found
      navigate('/blog');
    }
    
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!model) {
    return <div>Model not found</div>;
  }

  return (
    <>
      {/* Breadcrumb Area */}
      <div className="main-content">
        <div className="breadcrumb-area breadcarumb-style-1 pt--180 pb--100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-inner text-center">
                  <h3 className="title h3">Model Details</h3>
                  <ul className="page-list">
                    <li className="rainbow-breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="rainbow-breadcrumb-item"><Link to="/blog">AI Models</Link></li>
                    <li className="rainbow-breadcrumb-item active">{model.title}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Details Area */}
      <div className="rainbow-blog-section rainbow-section-gap-big bg-color-1">
        <div className="container">
          <div className="row row--30">
            <div className="col-lg-8">
              <div className="rainbow-blog-details-area">
                {/* Banner */}
                <div className="post-page-banner">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="content text-center">
                          <div className="thumbnail">
                            <img className="w-100 radius" src={model.image} alt={model.title} />
                          </div>
                          <ul className="rainbow-meta-list">
                            <li>
                              <i className="feather-user"></i>
                              <a href="#">AiWave Team</a>
                            </li>
                            <li>
                              <i className="feather-calendar"></i>
                              {model.date}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="blog-details-content pt--40">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="content">
                          <h2 className="title">{model.title}</h2>
                          <div dangerouslySetInnerHTML={{ __html: model.content }} />
                          
                          {/* Model Capabilities */}
                          <div className="model-capabilities mt--40">
                            <h4>Key Capabilities</h4>
                            <ul className="content-list">
                              {model.capabilities.map((capability, index) => (
                                <li key={index}>{capability}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Technical Details */}
                          <div className="technical-details mt--40">
                            <h4>Technical Specifications</h4>
                            <table className="table table-bordered">
                              <tbody>
                                {Object.entries(model.technicalDetails).map(([key, value], index) => (
                                  <tr key={index}>
                                    <th>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th>
                                    <td>{value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Try Model Button */}
                          <div className="try-model-section text-center mt--60">
                            <h3>Ready to experience this model?</h3>
                            <p>Try out the {model.title} with your own data and see the results in real-time.</p>
                            <Link to={`/try-model/${model.id}`} className="btn-default">
                              <span>Try This Model <i className="fa-sharp fa-regular fa-arrow-right"></i></span>
                            </Link>
                          </div>
                          
                          {/* Tags */}
                          <div className="category-meta mt--60">
                            <span className="text">Tags:</span>
                            <div className="tagcloud">
                              <a href="#">{model.category}</a>
                              <a href="#">AI</a>
                              <a href="#">Machine Learning</a>
                              <a href="#">Technology</a>
                              <a href="#">Innovation</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4 mt_md--40 mt_sm--40">
              <aside className="rainbow-sidebar">
                <div className="rbt-single-widget widget_search mt--40">
                  <div className="inner">
                    <form className="blog-search" action="#">
                      <input type="text" placeholder="Search AI Models..." />
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
                      <li><a href="#"><span className="left-content">Natural Language Processing</span><span className="count-text">2</span></a></li>
                      <li><a href="#"><span className="left-content">Computer Vision</span><span className="count-text">1</span></a></li>
                      <li><a href="#"><span className="left-content">Machine Learning</span><span className="count-text">1</span></a></li>
                      <li><a href="#"><span className="left-content">Speech Processing</span><span className="count-text">1</span></a></li>
                      <li><a href="#"><span className="left-content">Data Science</span><span className="count-text">1</span></a></li>
                    </ul>
                  </div>
                </div>

                

                <div className="rbt-single-widget widget_tag_cloud mt--40">
                  <h3 className="title">Tags</h3>
                  <div className="inner">
                    <div className="tagcloud">
                      <a href="#">{model.category}</a>
                      <a href="#">AI</a>
                      <a href="#">Machine Learning</a>
                      <a href="#">Technology</a>
                      <a href="#">Innovation</a>
                      <a href="#">Data</a>
                      <a href="#">Analytics</a>
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

export default BlogDetails;