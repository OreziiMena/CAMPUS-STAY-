import prisma from "@/lib/prisma";

export type AgentActionType = 
  | "PROPERTY_CREATED"
  | "PROPERTY_UPDATED"
  | "PROPERTY_DELETED"
  | "PROPERTY_AVAILABILITY_TOGGLED";

interface LogAgentActivityParams {
  userId?: string;
  userName: string;
  userEmail: string;
  userRole?: string;
  action: AgentActionType | string;
  description: string;
  propertyId?: string;
  propertyTitle?: string;
  metadata?: Record<string, any>;
}

export async function logAgentActivity({
  userId,
  userName,
  userEmail,
  userRole = "AGENT",
  action,
  description,
  propertyId,
  propertyTitle,
  metadata,
}: LogAgentActivityParams) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        userId,
        userName,
        userEmail,
        userRole,
        action,
        description,
        propertyId,
        propertyTitle,
        metadata: metadata || {},
      },
    });
    return { success: true, log };
  } catch (error) {
    console.error("[ActivityLogger Error]: Failed to create activity log:", error);
    return { success: false, error };
  }
}
