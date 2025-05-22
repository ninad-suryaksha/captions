import { NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"
export const maxDuration = 600 // Doubled duration to handle much more content

export async function POST(req: Request) {
  try {
    const {
      url,
      platform,
      briefing,
      targetAudienceAge,
      targetAudienceInterests,
      targetAudienceNeeds,
      communicationTone,
    } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Search for latest AI trends if available
    let trendsContext = ""
    try {
      // First, determine what AI trends we need to search for based on the URL and industry
      const trendSearchPrompt = `Based on the website ${url}, what are the top 3 specific AI trends relevant to this industry that I should search for to create content? Format your response as a JSON array with just the search terms, no explanations.`
      
      const trendSearchResponse = await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: [{ role: "user", content: trendSearchPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500,
      })
      
      const searchTerms = JSON.parse(trendSearchResponse.choices[0].message.content || "{}")
      
      // Now search for each AI trend and compile the results
      if (searchTerms && searchTerms.searchTerms && Array.isArray(searchTerms.searchTerms)) {
        let trendResults = []
        
        for (const term of searchTerms.searchTerms) {
          // Get trend information for the specific AI term
          const trendResponse = await openai.chat.completions.create({
            model: "gpt-4o-2024-11-20",
            messages: [{ role: "user", content: `What are the latest trends and innovations in "${term}"? Provide a detailed summary focusing on the most cutting-edge developments.` }],
            temperature: 0.7,
            max_tokens: 800,
          })
          trendResults.push(`Latest AI trends for "${term}": ${trendResponse.choices[0].message.content}`)
        }
        
        // Get general AI trends in content creation for social media
        const socialMediaAIResponse = await openai.chat.completions.create({
          model: "gpt-4o-2024-11-20",
          messages: [{ role: "user", content: `What are the latest ways AI is being used to create or enhance content for social media platforms like Instagram, Facebook, YouTube, and LinkedIn?` }],
          temperature: 0.7,
          max_tokens: 800,
        })
        trendResults.push(`AI in social media content creation: ${socialMediaAIResponse.choices[0].message.content}`)
        
        trendsContext = "CURRENT AI TRENDS RESEARCH:\n" + trendResults.join("\n\n") + "\n\nUse the above AI trends research to inform your content creation and ensure it discusses the most current and relevant AI technologies and applications. Make specific references to these trends in your content ideas."
      }
    } catch (searchError) {
      console.log("Error searching for AI trends:", searchError)
      // Continue even if trend search fails
      trendsContext = "Note: Unable to search for current AI trends. Use your existing knowledge to suggest cutting-edge AI content."
    }

    // Prepare the prompt with additional fields if provided
    let additionalContext = ""
    if (briefing) additionalContext += `Briefing: ${briefing}\n`
    if (targetAudienceAge) additionalContext += `Target Audience Age: ${targetAudienceAge}\n`
    if (targetAudienceInterests) additionalContext += `Target Audience Interests: ${targetAudienceInterests}\n`
    if (targetAudienceNeeds) additionalContext += `Target Audience Needs: ${targetAudienceNeeds}\n`
    if (communicationTone) additionalContext += `Communication Tone: ${communicationTone}\n`

    // Create the system message
    const systemPrompt = `You are a professional AI trends analyst and social media strategist. Analyze the website at ${url} and generate tailored AI trend content ideas for ${platform || "all social media platforms"}.

${additionalContext}

${trendsContext}

Your task:
1. Analyze the website to understand the brand's industry, offerings, and target audience.
2. Identify how AI technology is relevant to this industry or business.
3. Based on this analysis, create a detailed AI trend content strategy for ${platform || "Instagram, Facebook, YouTube, and LinkedIn"}.
4. For each platform, generate EXACTLY 6 distinct and diverse AI-focused content ideas that align with the brand's business and goals. This is a CRITICAL requirement - you MUST create 6 ideas for each platform, not more, not less.
5. Include creative elements and strategic recommendations that highlight cutting-edge AI applications.
6. EXTREMELY IMPORTANT: Provide exceptionally detailed content for each idea. Every idea must include comprehensive design details with COMPLETE shot lists, technical specifications, and designer notes. These should be extremely thorough with multiple paragraphs of detail.
7. Ensure each platform's content leverages the unique features of that platform and incorporates current AI trends.

If a specific platform is requested (${platform}), focus solely on that platform but still provide EXACTLY 6 ideas with maximum detail for each.

THE EXACT BREAKDOWN REQUIRED:
- Instagram: EXACTLY 6 detailed AI-focused ideas
- Facebook: EXACTLY 6 detailed AI-focused ideas
- YouTube: EXACTLY 6 detailed AI-focused ideas
- LinkedIn: EXACTLY 6 detailed AI-focused ideas

Return your response in a JSON format with the following structure:
{
  "brandAnalysis": {
    "name": "Brand Name",
    "domain": "domain.com",
    "personality": "Detailed description of brand voice/personality",
    "tone": "Formal/casual/etc.",
    "focus": "Main product/service focus"
  },
  "content": {
    "instagram": {
      "brief": "Comprehensive AI trend strategy for Instagram",
      "detailed": {
        "focus": "Key AI focus area for Instagram",
        "ideas": [
          {
            "title": "AI trend content idea title",
            "visual": "Detailed visual concept description incorporating AI",
            "caption": "Full suggested caption highlighting AI with hashtags",
            "contentType": "reel or post",
            "duration": "For reels (e.g., 15-30 seconds)",
            "musicOptions": ["Trending song 1 - Artist", "Trending song 2 - Artist"],
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 9:16", "Resolution: 1080x1920", "Frame Rate: 30fps", "Color Palette: specific colors"],
              "shotList": ["Shot 1: Extremely detailed description", "Shot 2: Extremely detailed description", "Shot 3: Extremely detailed description", "Shot 4: Extremely detailed description"],
              "designerNotes": "Comprehensive notes for AI-focused design approach, style guidance, and implementation tips"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "engagementRate": "Estimated engagement rate for AI content",
          "bestContentType": "Best performing AI content type",
          "optimalPosting": "Optimal posting time",
          "averageViewDuration": "Average view duration for video content",
          "bestVideoType": "Best performing video type"
        },
        "contentMix": {
          "categories": ["AI Category 1", "AI Category 2", "AI Category 3", "AI Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    },
    "facebook": {
      "brief": "Comprehensive AI trend strategy for Facebook",
      "detailed": {
        "focus": "Key AI focus area for Facebook",
        "ideas": [
          {
            "title": "AI trend content idea title",
            "content": "Full post content about AI with engaging text",
            "callToAction": "Detailed call to action",
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 16:9", "Resolution: 1200x628", "Color Profile: sRGB"],
              "shotList": ["Shot 1: Extremely detailed description", "Shot 2: Extremely detailed description", "Shot 3: Extremely detailed description"],
              "designerNotes": "Comprehensive notes for AI-focused design approach, style guidance, and implementation tips"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "engagementRate": "Estimated engagement rate",
          "clickThroughRate": "Estimated click-through rate",
          "optimalPosting": "Optimal posting time",
          "bestContentType": "Best performing AI content type"
        },
        "contentMix": {
          "categories": ["AI Category 1", "AI Category 2", "AI Category 3", "AI Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    },
    "youtube": {
      "brief": "Comprehensive AI trend strategy for YouTube",
      "detailed": {
        "focus": "Key AI focus area for YouTube",
        "ideas": [
          {
            "title": "AI trend content idea title",
            "format": "Detailed video format description",
            "productionNotes": "Comprehensive production suggestions for AI content",
            "outline": "Detailed video outline focusing on AI with sections",
            "contentType": "shorts or long-form",
            "duration": "Suggested duration",
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail", "Key visual themes with descriptions"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 16:9", "Resolution: 1920x1080", "Audio Quality: 48kHz stereo", "Lighting: detailed requirements"],
              "shotList": ["Shot 1: Extremely detailed description", "Shot 2: Extremely detailed description", "Shot 3: Extremely detailed description", "Shot 4: Extremely detailed description", "Shot 5: Extremely detailed description"],
              "designerNotes": "Comprehensive notes for AI-focused visual style, editing approach, and production techniques"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "averageViewDuration": "Estimated average view duration",
          "clickThroughRate": "Estimated click-through rate",
          "subscriberConversion": "Estimated subscriber conversion rate",
          "bestVideoType": "Best performing AI video type",
          "optimalLength": "Optimal video length"
        },
        "contentMix": {
          "categories": ["AI Category 1", "AI Category 2", "AI Category 3", "AI Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    },
    "linkedin": {
      "brief": "Comprehensive AI trend strategy for LinkedIn",
      "detailed": {
        "focus": "Key AI focus area for LinkedIn",
        "ideas": [
          {
            "title": "AI trend content idea title",
            "content": "Full post content about AI trends with professional tone",
            "dataPoints": "Detailed key AI data points to include",
            "trendAnalysis": "In-depth analysis of AI industry trends",
            "conclusion": "Comprehensive concluding thoughts on AI implications",
            "callToAction": "Professional call to action",
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail", "Professional graphic elements with descriptions"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 1200x627", "Format: PNG or PDF for documents", "Color Profile: sRGB"],
              "shotList": ["Shot/Section 1: Extremely detailed description", "Shot/Section 2: Extremely detailed description", "Shot/Section 3: Extremely detailed description"],
              "designerNotes": "Comprehensive notes about AI-focused professional styling, branding consistency, and corporate design elements"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "engagementRate": "Estimated engagement rate",
          "impressions": "Estimated impressions",
          "clickThroughRate": "Estimated click-through rate",
          "leadGeneration": "Estimated lead generation potential",
          "optimalPosting": "Optimal posting time" 
        },
        "contentMix": {
          "categories": ["AI Category 1", "AI Category 2", "AI Category 3", "AI Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    }
  }
}`

    // Make the API request using chat completions API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 32000, // Greatly increased token limit to handle extremely detailed content
    })

    // Parse the JSON response
    let jsonResponse
    try {
      jsonResponse = JSON.parse(response.choices[0].message.content || "{}")
    } catch (parseError: any) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", response.choices[0].message.content)
      return NextResponse.json({ error: "Failed to parse API response" }, { status: 500 })
    }

    return NextResponse.json(jsonResponse)
  } catch (error: any) {
    console.error("Error generating AI trends:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
